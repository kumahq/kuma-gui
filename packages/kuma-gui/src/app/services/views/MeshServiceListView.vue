<template>
  <RouteView
    name="mesh-service-list-view"
    :params="{
      page: 1,
      size: Number,
      mesh: '',
      service: '',
    }"
    v-slot="{ route, t, can, uri, me }"
  >
    <RouteTitle
      :render="false"
      :title="t(`services.routes.mesh-service-list-view.title`)"
    />
    <AppView
      :docs="t('services.mesh-service.href.docs')"
    >
      <XCard>
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
              :page="route.params.page"
              :page-size="route.params.size"
              :total="data?.total"
              @change="route.update"
            >
              <AppCollection
                data-testid="service-collection"
                :headers="[
                  { ...me.get('headers.name'), label: 'Name', key: 'name' },
                  { ...me.get('headers.namespace'), label: 'Namespace', key: 'namespace' },
                  ...(can('use zones') ? [{ ...me.get('headers.zone'), label: 'Zone', key: 'zone' }] : []),
                  { ...me.get('headers.state'), label: 'State', key: 'state' },
                  { ...me.get('headers.status'), label: 'DP proxies (connected / healthy / total)', key: 'status' },
                  { ...me.get('headers.ports'), label: 'Ports', key: 'ports' },
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
                  </XCopyButton>
                </template>
                <template
                  #namespace="{ row: item }"
                >
                  {{ item.namespace }}
                </template>
                <template
                  #zone="{ row: item }"
                >
                  <template
                    v-if="item.zone"
                  >
                    <XAction
                      :to="{
                        name: 'zone-cp-detail-view',
                        params: {
                          zone: item.zone,
                        },
                      }"
                    >
                      {{ item.zone }}
                    </XAction>
                  </template>

                  <template
                    v-else
                  >
                    {{ t('common.detail.none') }}
                  </template>
                </template>
                <template
                  #state="{ row: item }"
                >
                  <XBadge
                    :appearance="item.spec.state === 'Available' ? 'success' : 'danger'"
                  >
                    {{ item.spec.state }}
                  </XBadge>
                </template>
                <template
                  #status="{ row: item }"
                >
                  {{ item.status.dataplaneProxies?.connected }} / {{ item.status.dataplaneProxies?.healthy }} / {{ item.status.dataplaneProxies?.total }}
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
                  #actions="{ row: item }"
                >
                  <XActionGroup>
                    <XAction
                      :to="{
                        name: 'mesh-service-detail-view',
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
      </XCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import SummaryView from '@/app/common/SummaryView.vue'
</script>
