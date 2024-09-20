<template>
  <RouteView
    name="mesh-multi-zone-service-list-view"
    :params="{
      page: 1,
      size: 50,
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
      <KCard>
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
            >
              <AppCollection
                :headers="[
                  { ...me.get('headers.name'), label: 'Name', key: 'name' },
                  { ...me.get('headers.ports'), label: 'Ports', key: 'ports' },
                  { ...me.get('headers.labels'), label: 'Selector', key: 'labels' },
                  { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                ]"
                :page-number="route.params.page"
                :page-size="route.params.size"
                :total="data?.total"
                :items="data?.items"
                :is-selected-row="(item) => item.name === route.params.service"
                @change="route.update"
                @resize="me.set"
              >
                <template #name="{ row: item }">
                  <TextWithCopyButton
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
                  </TextWithCopyButton>
                </template>
                <template
                  #ports="{ row: item }"
                >
                  <KTruncate>
                    <KumaPort
                      v-for="connection in item.spec.ports"
                      :key="connection.port"
                      :port="{
                        ...connection,
                        targetPort: undefined,
                      }"
                    />
                  </KTruncate>
                </template>
                <template
                  #labels="{ row: item }"
                >
                  <KTruncate>
                    <KBadge
                      v-for="(value, key) in item.spec.selector.meshService.matchLabels"
                      :key="`${key}:${value}`"
                      appearance="info"
                    >
                      {{ key }}:{{ value }}
                    </KBadge>
                  </KTruncate>
                </template>
                <template #actions="{ row: item }">
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
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
</script>
