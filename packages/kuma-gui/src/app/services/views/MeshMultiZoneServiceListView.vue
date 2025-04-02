<template>
  <RouteView
    name="mesh-multi-zone-service-list-view"
    :params="{
      page: 1,
      size: Number,
      mesh: '',
      service: '',
    }"
    v-slot="{ route, t, uri, me }"
  >
    <RouteTitle
      :render="false"
      :title="t(`services.routes.mesh-multi-zone-service-list-view.title`)"
    />
    <AppView
      :docs="t('services.mesh-multi-zone-service.href.docs')"
    >
      <XCard>
        <DataLoader
          :src="uri(sources, '/meshes/:mesh/mesh-multi-zone-services', {
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
              :page="route.params.page"
              :page-size="route.params.size"
              :total="data?.total"
              @change="route.update"
            >
              <AppCollection
                :headers="[
                  { ...me.get('headers.name'), label: 'Name', key: 'name' },
                  { ...me.get('headers.ports'), label: 'Ports', key: 'ports' },
                  { ...me.get('headers.labels'), label: 'Selector', key: 'labels' },
                  { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                ]"
                :items="data?.items"
                :is-selected-row="(item) => item.name === route.params.service"
                @resize="me.set"
              >
                <template
                  #name="{ row: item }"
                >
                  <XCopyButton
                    :text="item.name"
                  >
                    <XAction
                      data-action
                      :to="{
                        name: 'mesh-multi-zone-service-summary-view',
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
                  </XCopyButton>
                </template>
                <template
                  #ports="{ row: item }"
                >
                  <XLayout
                    type="separated"
                    truncate
                  >
                    <KumaPort
                      v-for="connection in item.spec.ports"
                      :key="connection.port"
                      :port="{
                        ...connection,
                        targetPort: undefined,
                      }"
                    />
                  </XLayout>
                </template>
                <template
                  #labels="{ row: item }"
                >
                  <XLayout
                    type="separated"
                    truncate
                  >
                    <XBadge
                      v-for="(value, key) in item.spec.selector.meshService.matchLabels"
                      :key="`${key}:${value}`"
                      appearance="info"
                    >
                      {{ key }}:{{ value }}
                    </XBadge>
                  </XLayout>
                </template>
                <template
                  #actions="{ row: item }"
                >
                  <XActionGroup>
                    <XAction
                      :to="{
                        name: 'mesh-multi-zone-service-detail-view',
                        params: {
                          mesh: item.mesh,
                          service: item.id,
                        },
                      }"
                    >
                      {{ t('common.collection.actions.view') }}
                    </XAction>
                  </XActionGroup>
                </template>
              </AppCollection>
              <RouterView
                v-if="data?.items && route.params.service"
                v-slot="child"
              >
                <SummaryView
                  @close="route.replace({
                    name: 'mesh-multi-zone-service-list-view',
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
      </XCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import SummaryView from '@/app/common/SummaryView.vue'
</script>
