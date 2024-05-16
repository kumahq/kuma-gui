<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t, uri }"
      name="mesh-service-list-view"
      :params="{
        page: 1,
        size: me.pageSize,
        mesh: '',
        service: '',
      }"
    >
      <AppView>
        <template #title>
          <XTeleportTemplate
            :to="{ name: 'service-list-tabs-view-title'}"
          >
            <h2>
              <RouteTitle
                :title="t(`services.routes.mesh-service-list-view.title`)"
              />
            </h2>
          </XTeleportTemplate>
        </template>
        <KCard>
          <DataLoader
            :src="uri(sources, '/meshes/:mesh/mesh-services', {
              mesh: route.params.mesh,
            },{
              page: route.params.page,
              size: route.params.size,
            })"
          >
            <template
              #loadable="{ data }"
            >
              <DataCollection
                type="services"
                :items="data?.items ?? [undefined]"
              >
                <AppCollection
                  data-testid="service-collection"
                  :headers="[
                    { label: 'Name', key: 'name' },
                    { label: 'Namespace', key: 'namespace' },
                  ]"
                  :page-number="route.params.page"
                  :page-size="route.params.size"
                  :total="data?.total"
                  :items="data?.items"
                  :is-selected-row="(item) => item.name === route.params.service"
                  @change="route.update"
                >
                  <template #name="{ row: item }">
                    <TextWithCopyButton
                      :text="item.name"
                    >
                      <XAction
                        :to="{
                          name: 'mesh-service-summary-view',
                          params: {
                            mesh: item.mesh,
                            service: item.id,
                          },
                          query: {
                            page: route.params.page,
                            size: route.params.size,
                          },
                        }"
                      >
                        {{ item.name }}
                      </XAction>
                    </TextWithCopyButton>
                  </template>
                </AppCollection>
                <RouterView
                  v-if="data?.items && route.params.service"
                  v-slot="child"
                >
                  <SummaryView
                    @close="route.replace({
                      name: 'mesh-service-list-view',
                      params: {
                        mesh: route.params.mesh,
                      },
                      query: {
                        page: route.params.page,
                        size: route.params.size,
                      },
                    })"
                  >
                    <component
                      :is="child.Component"
                      :items="data?.items"
                    />
                  </SummaryView>
                </RouterView>
              </DataCollection>
            </template>
          </DataLoader>
        </KCard>
      </AppView>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { MeSource } from '@/app/me/sources'
</script>
