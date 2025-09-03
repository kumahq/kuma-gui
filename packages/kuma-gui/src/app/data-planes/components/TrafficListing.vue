<template>
  <DataSource
    :src="uri(connectionSources, '/connections/stats/for/:proxyType/:name/:mesh/:socketAddress', {
      proxyType: ({ ingresses: 'zone-ingress', egresses: 'zone-egress' })[route.params.proxyType as string] ?? 'dataplane',
      name: route.params.proxy as string,
      mesh: route.params.mesh as string || '*',
      // 'self_inbound' can be used as socket address to filter the stats as the contextual kri of an inbound always starts with 'self_inbound'
      socketAddress: 'self_inbound',
    })"
    v-slot="{ data: traffic, error: trafficError, refresh: refreshTraffic }"
  >
    <DataSource
      :src="uri(sources, '/meshes/:mesh/dataplanes/:name/layout', {
        mesh: route.params.mesh as string,
        name: route.params.proxy as string,
      })"
      v-slot="{ data: dataplaneLayout, refresh, error }"
    >
      <DataLoader
        :data="[traffic, dataplaneLayout]"
        :errors="[trafficError, error]"
      >
        <XNotification
          :notify="!!trafficError"
          :data-testid="`warning-stats-not-enhanced`"
          :uri="`data-planes.notifications.stats-not-enhanced.${props.data.id}`"
        >
          <XI18n
            :path="`data-planes.notifications.stats-not-enhanced`"
            :params="Object.fromEntries(Object.entries({
              error: trafficError?.toString() ?? '',
            }))"
          />
        </XNotification>
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
              v-for="inbounds in [dataplaneLayout?.inbounds ?? []]"
              :key="typeof inbounds"
            >
              <ConnectionGroup
                type="inbound"
                data-testid="dataplane-inbounds"
              >
                <!-- don't show a card for anything on port 49151 as those are service-less inbounds -->
                <DataCollection
                  type="inbounds"
                  :items="inbounds"
                  :predicate="(item) => item.port !== 49151"
                >
                  <template
                    v-if="props.data.dataplaneType === 'delegated'"
                    #empty
                  >
                    <XEmptyState>
                      <p>
                        This proxy is a delegated gateway therefore {{ t('common.product.name') }} does not have any
                        visibility into inbounds for this gateway.
                      </p>
                    </XEmptyState>
                  </template>
                  <template
                    #default="{ items: _inbounds }"
                  >
                    <XLayout
                      type="stack"
                      size="small"
                    >
                      <template
                        v-for="item in _inbounds"
                        :key="`${item.kri}`"
                      >
                        <ConnectionCard
                          data-testid="dataplane-inbound"
                          :protocol="item.protocol"
                          :port-name="ContextualKri.fromString(item.proxyResourceName).sectionName"
                          :traffic="traffic?.inbounds[ContextualKri.toString({ ...ContextualKri.fromString(item.proxyResourceName), sectionName: item.port.toString() })]"
                        >
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
                    </XLayout>
                  </template>
                </DataCollection>
              </ConnectionGroup>
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
                        :port-name="Kri.fromString(outbound.proxyResourceName).sectionName"
                        :traffic="traffic?.outbounds[outbound.proxyResourceName]"
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
    </DataSource>
  </DataSource>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

import { useI18n } from '@/app/application'
import { useUri } from '@/app/application/services/data-source'
import ConnectionCard from '@/app/connections/components/connection-traffic/ConnectionCard.vue'
import ConnectionGroup from '@/app/connections/components/connection-traffic/ConnectionGroup.vue'
import ConnectionTraffic from '@/app/connections/components/connection-traffic/ConnectionTraffic.vue'
import { sources as connectionSources } from '@/app/connections/sources'
import { sources } from '@/app/data-planes/sources'
import { ContextualKri, Kri } from '@/app/kuma/kri'

const props = defineProps<{
  data: {
    id: string
    dataplaneType: 'standard' | 'delegated' | 'builtin'
  }
}>()

const uri = useUri()
const route = useRoute()
const { t } = useI18n()

</script>

<style scoped>

</style>