<template>
  <XLayout
    class="traffic"
    type="stack"
  >
    <h1>FEATURED</h1>
    <DataLoader
      :src="uri(sources, '/meshes/:mesh/dataplane-overviews/:name', {
        mesh: route.params.mesh as string,
        name: route.params.proxy as string,
      })"
      v-slot="{}"
    >
      <DataLoader
        :src="uri(policySources, '/meshes/:mesh/dataplanes/:name/policies/for/proxy', {
          mesh: route.params.mesh as string,
          name: route.params.proxy as string,
        })"
        v-slot="{ data: resources }"
      >
        <DataLoader
          :src="uri(sources, '/meshes/:mesh/dataplane-overviews/:name', {
            mesh: route.params.mesh as string,
            name: route.params.proxy as string,
          })"
          v-slot="{ data: dataplaneOverview }"
        >
          <DataLoader
            :src="uri(sources, '/meshes/:mesh/dataplanes/:name/layout', {
              mesh: route.params.mesh as string,
              name: route.params.proxy as string,
            })"
            v-slot="{ data: dataplaneLayout, refresh, error }"
          >
            <DataLoader
              :src="uri(connectionSources, '/connections/stats/for/:proxyType/:name/:mesh/:socketAddress', {
                proxyType: ({ ingresses: 'zone-ingress', egresses: 'zone-egress' })[route.params.proxyType as string] ?? 'dataplane',
                name: route.params.proxy as string,
                mesh: route.params.mesh as string | undefined || '*',
                // 'self_inbound' can be used as socket address to filter the stats as the contextual kri of an inbound always starts with 'self_inbound'
                socketAddress: 'self_inbound',
              })"
              v-slot="{ data: traffic, error: trafficError, refresh: refreshTraffic }"
            >
              <XNotification
                :notify="!!trafficError"
                :data-testid="`warning-stats-not-enhanced`"
                :uri="`data-planes.notifications.stats-not-enhanced.${props.data.id}`"
              >
                <XI18n
                  :path="`data-planes.notifications.stats-not-enhanced`"
                  :params="{
                    error: trafficError?.toString() ?? '',
                  }"
                />
              </XNotification>
              <XCard
                class="traffic"
                data-testid="dataplane-traffic"
              >
                <DataLoader
                  :data="[dataplaneOverview, dataplaneLayout, traffic]"
                >
                  <XLayout
                    type="columns"
                  >
                    <ConnectionTraffic>
                      <template
                        #title
                      >
                        <XLayout
                          type="separated"
                        >
                          <XIcon
                            name="inbound"
                          />
                          <span>Inbounds</span>
                        </XLayout>
                      </template>
                      <template
                        v-for="(inboundsByPort, port) in [Object.groupBy(dataplaneOverview!.dataplane.networking.inbounds, (item) => item.port)]"
                        :key="port"
                      >
                        <template
                          v-for="inbounds in [dataplaneLayout!.inbounds]"
                          :key="typeof inbounds"
                        >
                          <ConnectionGroup
                            type="inbound"
                            data-testid="dataplane-inbounds"
                          >
                            <XLayout
                              type="stack"
                              size="small"
                            >
                              <template
                                v-for="item in inbounds"
                                :key="`${item.kri}`"
                              >
                                <template
                                  v-for="inbound in [inboundsByPort[item.port]?.[0]]"
                                  :key="inbound?.port"
                                >
                                  <ConnectionCard
                                    data-testid="dataplane-inbound"
                                    :protocol="item.protocol"
                                    :port-name="inbound?.portName"
                                    :traffic="traffic?.inbounds[item.stat_prefix]"
                                    data-actionable
                                  >
                                    <template #state>
                                      <XIcon
                                        v-if="inbound?.state !== 'Ready'"
                                        name="danger"
                                        :size="KUI_ICON_SIZE_40"
                                        placement="right"
                                      >
                                        {{ t('data-planes.routes.item.unhealthy_inbound', { port: inbound?.port }) }}
                                      </XIcon>
                                    </template>
                                    <XAction
                                      data-action
                                      :to="{
                                        name: ((name) => name.includes('bound') ? name.replace('-outbound-', '-inbound-') : 'data-plane-connection-inbound-summary-overview-view')(String(route.name)),
                                        params: {
                                          connection: item.proxyResourceName,
                                        },
                                        query: {
                                          inactive: route.params.inactive,
                                        },
                                      }"
                                    >
                                      {{ item.proxyResourceName }}
                                    </XAction>
                                  </ConnectionCard>
                                </template>
                              </template>
                            </XLayout>
                          </ConnectionGroup>
                        </template>
                      </template>
                    </ConnectionTraffic>

                    <ConnectionTraffic>
                      <template
                        #actions
                      >
                        <XAction
                          action="refresh"
                          appearance="primary"
                          @click="() => {
                            refresh()
                            refreshTraffic()
                          }"
                        >
                          Refresh
                        </XAction>
                      </template>
                      <template
                        #title
                      >
                        <XLayout type="separated">
                          <XIcon name="outbound" />
                          <span>Outbounds</span>
                        </XLayout>
                      </template>
                      <!-- we don't want to show an error here -->
                      <!-- instead we show a No Data EmptyState -->
                      <template
                        v-if="typeof error === 'undefined' && typeof trafficError === 'undefined' && dataplaneLayout?.outbounds.length"
                      >
                        <ConnectionGroup
                          type="passthrough"
                        >
                          <ConnectionCard
                            :protocol="`passthrough`"
                            :traffic="traffic?.passthrough"
                          >
                            Non mesh traffic
                          </ConnectionCard>
                        </ConnectionGroup>
                        <DataCollection
                          type="outbounds"
                          :items="dataplaneLayout?.outbounds"
                          v-slot="{ items: outbounds }"
                        >
                          <ConnectionGroup
                            type="outbound"
                            data-testid="dataplane-outbounds"
                          >
                            <XLayout
                              type="stack"
                              size="small"
                            >
                              <template
                                v-for="outbound in outbounds"
                                :key="outbound.kri"
                              >
                                <ConnectionCard
                                  data-testid="dataplane-outbound"
                                  :protocol="outbound.protocol"
                                  :traffic="traffic?.outbounds[outbound.kri]"
                                  data-actionable
                                >
                                  <XAction
                                    data-action
                                    :to="{
                                      name: ((name) => name.includes('bound') ? name.replace('-inbound-', '-outbound-') : 'data-plane-connection-outbound-summary-overview-view')(String(route.name)),
                                      params: {
                                        connection: outbound.proxyResourceName,
                                      },
                                      query: {
                                        inactive: route.params.inactive,
                                      },
                                    }"
                                  >
                                    {{ outbound.proxyResourceName }}
                                  </XAction>
                                </ConnectionCard>
                              </template>
                            </XLayout>
                          </ConnectionGroup>
                        </DataCollection>
                      </template>
                      <template
                        v-else
                      >
                        <XEmptyState />
                      </template>
                    </ConnectionTraffic>
                  </XLayout>
                </DataLoader>
              </XCard>
              <RouterView
                v-slot="child"
              >
                <XDrawer
                  v-if="child.route.name !== route.name"
                  width="670px"
                  @close="() => {
                    router.replace({
                      name: 'data-plane-detail-view',
                      params: {
                        mesh: route.params.mesh,
                        proxy: route.params.proxy,
                      },
                      query: {
                        inactive: route.params.inactive ? null : undefined,
                      },
                    })

                  }"
                >
                  <component
                    :is="child.Component"
                    :data="(child.route.name as string).includes('-inbound-') ? dataplaneLayout?.inbounds : dataplaneLayout?.outbounds"
                    :data-plane-overview="props.data"
                    :networking="dataplaneOverview!.dataplane.networking"
                    :policies="resources?.policies"
                  />
                </XDrawer>
              </RouterView>
            </DataLoader>
          </DataLoader>
        </DataLoader>
      </DataLoader>
    </DataLoader>
  </XLayout>
</template>

<script setup lang="ts">
import { KUI_ICON_SIZE_40 } from '@kong/design-tokens'
import { useRoute, useRouter } from 'vue-router'

import { useI18n } from '@/app/application'
import { useUri } from '@/app/application/services/data-source'
import ConnectionCard from '@/app/connections/components/connection-traffic/ConnectionCard.vue'
import ConnectionGroup from '@/app/connections/components/connection-traffic/ConnectionGroup.vue'
import ConnectionTraffic from '@/app/connections/components/connection-traffic/ConnectionTraffic.vue'
import { sources as connectionSources } from '@/app/connections/sources'
import { sources, type DataplaneOverview } from '@/app/data-planes/sources'
import { sources as policySources } from '@/app/policies/sources'

const props = defineProps<{
  data: {
    id: string
    dataplaneType: 'standard' | 'delegated' | 'builtin'
  }
  dataplaneOverview: DataplaneOverview
}>()

const uri = useUri()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

</script>

<style lang="scss" scoped>
.traffic {
  container-type: inline-size;
  container-name: traffic;

  .columns {
    padding: $kui-space-40;
    background: linear-gradient(90deg, rgba(0, 0, 0, .1) 1px, transparent 1px);
    background-position: 100% 0;
    background-repeat: repeat-y;
    background-size: 50%;
  }
}

.traffic .tag-list {
  margin-left: auto;
}


@container traffic (max-width: 40.95rem) {
  .traffic .columns {
    background: none;
  }
}
</style>
