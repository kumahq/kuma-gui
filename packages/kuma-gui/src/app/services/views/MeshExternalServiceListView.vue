<template>
  <RouteView
    name="mesh-external-service-list-view"
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
      :title="t(`services.routes.mesh-external-service-list-view.title`)"
    />
    <DataSource
      :src="uri(egressSources, `/zone-cps/:name/egresses`, {
        name: '*',
      }, {
        page: 1,
        size: 100,
      })"
      v-slot="{ data: egresses }"
    >
      <AppView
        :docs="t('services.mesh-external-service.href.docs')"
        :notifications="true"
      >
        <XNotification
          v-if="!props.mesh.mtlsBackend"
          :uri="`mes-mtls-warning.${props.mesh.id}`"
        >
          <XI18n
            path="services.mesh-external-service.notifications.mtls-warning"
          />
        </XNotification>
        <XNotification
          v-if="egresses && !egresses.items.find((egress) => typeof egress.zoneEgressInsight.connectedSubscription !== 'undefined')"
          :uri="`mes-no-zone-ingress.${props.mesh.id}`"
        >
          <XI18n
            path="services.mesh-external-service.notifications.no-zone-egress"
          />
        </XNotification>
        <XCard>
          <DataLoader
            :src="uri(sources, '/meshes/:mesh/mesh-external-services', {
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
                    { ...me.get('headers.port'), label: 'Port', key: 'port' },
                    { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                  ]"
                  :items="data?.items"
                  :is-selected-row="(item) => item.name === route.params.service"
                  @resize="me.set"
                >
                  <template #name="{ row: item }">
                    <XCopyButton
                      :text="item.name"
                    >
                      <XAction
                        data-action
                        :to="{
                          name: 'mesh-external-service-summary-view',
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
                  <template #zone="{ row: item }">
                    <template v-if="item.labels && item.labels['kuma.io/origin'] === 'zone' && item.labels['kuma.io/zone']">
                      <XAction
                        v-if="item.labels['kuma.io/zone']"
                        :to="{
                          name: 'zone-cp-detail-view',
                          params: {
                            zone: item.labels['kuma.io/zone'],
                          },
                        }"
                      >
                        {{ item.labels['kuma.io/zone'] }}
                      </XAction>
                    </template>

                    <template v-else>
                      {{ t('common.detail.none') }}
                    </template>
                  </template>
                  <template
                    #port="{ row: item }"
                  >
                    <template
                      v-if="item.spec.match"
                    >
                      <KumaPort
                        :port="item.spec.match"
                      />
                    </template>
                  </template>

                  <template #actions="{ row: item }">
                    <XActionGroup>
                      <XAction
                        :to="{
                          name: 'mesh-external-service-detail-view',
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
                      name: 'mesh-external-service-list-view',
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
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import type { Mesh } from '@/app/meshes/data'
import { sources as egressSources } from '@/app/zone-egresses/sources'

const props = defineProps<{
  mesh: Mesh
}>()
</script>
