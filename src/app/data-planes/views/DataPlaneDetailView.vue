<template>
  <RouteView
    v-slot="{ route, t }"
    :params="{
      mesh: '',
      dataPlane: '',
      inactive: false,
    }"
    name="data-plane-detail-view"
  >
    <DataSource
      v-slot="{ data: traffic, error, refresh }: StatsSource"
      :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/stats/${props.data.dataplane.networking.inboundName}`"
    >
      <AppView>
        <template
          v-if="warnings.length > 0 || error"
          #notifications
        >
          <ul data-testid="dataplane-warnings">
            <!-- eslint-disable vue/no-v-html  -->
            <li
              v-for="warning in warnings"
              :key="warning.kind"
              :data-testid="`warning-${warning.kind}`"
              v-html="t(`common.warnings.${warning.kind}`, warning.payload)"
            />
            <li
              v-if="error"
              :data-testid="`warning-stats-loading`"
            >
              The below view is not enhanced with runtime stats (Error loading stats: <strong>{{ error.toString() }}</strong>)
            </li>
          <!-- eslint-enable -->
          </ul>
        </template>

        <div
          class="stack"
          data-testid="dataplane-details"
        >
          <KCard>
            <div class="columns">
              <DefinitionCard>
                <template #title>
                  {{ t('http.api.property.status') }}
                </template>

                <template #body>
                  <div class="status-with-reason">
                    <StatusBadge :status="props.data.status" />
                    <DataCollection
                      v-if="props.data.dataplane.networking.type === 'standard'"
                      v-slot="{ items : inbounds }"
                      :items="props.data.dataplane.networking.inbounds"
                      :predicate="item => !item.health.ready"
                      :empty="false"
                    >
                      <KTooltip
                        class="reason-tooltip"
                      >
                        <InfoIcon
                          :color="KUI_COLOR_BACKGROUND_NEUTRAL"
                          :size="KUI_ICON_SIZE_30"
                          hide-title
                        />
                        <template #content>
                          <ul>
                            <li
                              v-for="inbound in inbounds"
                              :key="`${inbound.service}:${inbound.port}`"
                            >
                              {{ t('data-planes.routes.item.unhealthy_inbound', { service: inbound.service, port: inbound.port }) }}
                            </li>
                          </ul>
                        </template>
                      </KTooltip>
                    </DataCollection>
                  </div>
                </template>
              </DefinitionCard>

              <DefinitionCard>
                <template #title>
                  {{ t('data-planes.routes.item.last_updated') }}
                </template>

                <template #body>
                  {{ t('common.formats.datetime', { value: Date.parse(props.data.modificationTime) }) }}
                </template>
              </DefinitionCard>

              <template v-if="props.data.dataplane.networking.gateway">
                <DefinitionCard>
                  <template #title>
                    {{ t('http.api.property.tags') }}
                  </template>

                  <template #body>
                    <TagList :tags="props.data.dataplane.networking.gateway.tags" />
                  </template>
                </DefinitionCard>

                <DefinitionCard>
                  <template #title>
                    {{ t('http.api.property.address') }}
                  </template>

                  <template #body>
                    <TextWithCopyButton :text="`${props.data.dataplane.networking.address}`" />
                  </template>
                </DefinitionCard>
              </template>
            </div>
          </KCard>

          <KCard
            class="traffic"
            data-testid="dataplane-traffic"
          >
            <div class="columns">
              <ConnectionTraffic>
                <template #title>
                  <ForwardIcon
                    decorative
                    :size="KUI_ICON_SIZE_30"
                  />
                  Inbounds
                </template>
                <ConnectionGroup
                  type="inbound"
                >
                  <DataCollection
                    :items="props.data.dataplane.networking.gateway ? (traffic?.inbounds ?? []).map((inbound): DataplaneInbound => {
                      return {
                        ...props.data.dataplane.networking.inbounds[0],
                        name: inbound.name,
                        port: Number(inbound.port),
                        protocol: inbound.protocol,
                      }
                    }) : props.data.dataplane.networking.inbounds"
                  >
                    <template
                      v-if="props.data.dataplaneType === 'delegated'"
                      #empty
                    >
                      <EmptyBlock>
                        <p>This proxy is a delegated gateway therefore {{ t('common.product.name') }} does not have any visibility into inbounds for this gateway</p>
                      </EmptyBlock>
                    </template>
                    <template #default="{ items: inbounds }">
                      <template
                        v-for="item in inbounds"
                        :key="`${item.name}`"
                      >
                        <!-- the finding here would be expensive if inbounds was commonly large -->
                        <!-- inbounds are mostly singular and even when they are not they are small -->
                        <template
                          v-for="inbound in [
                            (traffic || {inbounds: []}).inbounds.find(inbound => `${inbound.name}` === `${item.name}`),
                          ]"
                          :key="inbound"
                        >
                          <ConnectionCard
                            :protocol="inbound?.protocol ?? item.protocol"
                            :traffic="typeof error === 'undefined' ?
                              inbound :
                              {
                                name: '',
                                protocol: item.protocol as TrafficEntry['protocol'],
                                port: `${item.port}`,
                              }
                            "
                          >
                            <template
                              v-for="name in [`${item.name.replace(`_${item.port}`, '').replace('localhost', '')}:${item.port}`]"
                              :key="name"
                            >
                              <RouterLink
                                :to="{
                                  name: ((name) => name.includes('bound') ? name.replace('-outbound-', '-inbound-') : 'connection-inbound-summary-overview-view')(String(_route.name)),
                                  params: {
                                    service: name,
                                  },
                                  query: {
                                    inactive: route.params.inactive ? null : undefined,
                                  },
                                }"
                              >
                                {{ name }}
                              </RouterLink>
                            </template>
                            <TagList
                              :tags="[{label: 'kuma.io/service', value: item.tags['kuma.io/service']}]"
                            />
                          </ConnectionCard>
                        </template>
                      </template>
                    </template>
                  </DataCollection>
                </ConnectionGroup>
              </ConnectionTraffic>

              <ConnectionTraffic>
                <template
                  v-if="traffic"
                  #actions
                >
                  <KInputSwitch
                    v-model="route.params.inactive"
                    data-testid="dataplane-outbounds-inactive-toggle"
                  >
                    <template #label>
                      Show inactive
                    </template>
                  </KInputSwitch>

                  <KButton
                    appearance="primary"
                    @click="refresh"
                  >
                    <RefreshIcon />

                    Refresh
                  </KButton>
                </template>
                <template #title>
                  <GatewayIcon
                    decorative
                    :size="KUI_ICON_SIZE_30"
                  />
                  <span>Outbounds</span>
                </template>
                <!-- we don't want to show an error here -->
                <!-- instead we show a No Data EmptyBlock -->
                <template v-if="typeof error === 'undefined'">
                  <LoadingBlock v-if="typeof traffic === 'undefined'" />
                  <template
                    v-else
                  >
                    <!-- Outbounds for gateways report actual traffic on the upstream so we switch to upstream here for non-standard-->
                    <template
                      v-for="direction in ['upstream'] as const"
                      :key="direction"
                    >
                      <ConnectionGroup
                        type="passthrough"
                      >
                        <ConnectionCard
                          :protocol="`passthrough`"
                          :traffic="traffic.passthrough"
                        >
                          Non mesh traffic
                        </ConnectionCard>
                      </ConnectionGroup>
                      <DataCollection
                        v-slot="{ items }"
                        :predicate="route.params.inactive ? undefined : (item) => ((item.protocol === 'tcp' ? item.tcp?.[`${direction}_cx_rx_bytes_total`] : item.http?.[`${direction}_rq_total`]) as (number | undefined) ?? 0) > 0"
                        :items="traffic.outbounds"
                      >
                        <ConnectionGroup
                          v-if="items.length > 0"
                          type="outbound"
                          data-testid="dataplane-outbounds"
                        >
                          <template
                            v-for="item in items"
                            :key="`${item.name}`"
                          >
                            <ConnectionCard
                              :protocol="item.protocol"
                              :traffic="item"
                              :direction="direction"
                            >
                              <RouterLink
                                :to="{
                                  name: ((name) => name.includes('bound') ? name.replace('-inbound-', '-outbound-') : 'connection-outbound-summary-overview-view')(String(_route.name)),
                                  params: {
                                    service: item.name,
                                  },
                                  query: {
                                    inactive: route.params.inactive ? null : undefined,
                                  },
                                }"
                              >
                                {{ item.name }}
                              </RouterLink>
                            </ConnectionCard>
                          </template>
                        </ConnectionGroup>
                      </DataCollection>
                    </template>
                  </template>
                </template>
                <template v-else>
                  <EmptyBlock />
                </template>
              </ConnectionTraffic>
            </div>
          </KCard>

          <RouterView
            v-slot="child"
          >
            <SummaryView
              v-if="child.route.name !== route.name"
              width="670px"
              @close="function (_e) {
                route.replace({
                  name: 'data-plane-detail-view',
                  params: {
                    mesh: route.params.mesh,
                    dataPlane: route.params.dataPlane,
                  },
                  query: {
                    inactive: route.params.inactive ? null : undefined,
                  },
                })

              }"
            >
              <component
                :is="child.Component"
                :dataplane-type="props.data.dataplaneType"
                :gateway="props.data.dataplane.networking.gateway"
                :inbounds="(child.route.name as string).includes('-inbound-') ? props.data.dataplane.networking.inbounds : []"
                :data="(child.route.name as string).includes('-inbound-') ? traffic?.inbounds || [] : traffic?.outbounds || []"
              />
            </SummaryView>
          </RouterView>

          <div data-testid="dataplane-mtls">
            <h2>{{ t('data-planes.routes.item.mtls.title') }}</h2>

            <template
              v-if="props.data.dataplaneInsight.mTLS"
            >
              <template
                v-for="mTLS in [
                  props.data.dataplaneInsight.mTLS,
                ]"
                :key="mTLS"
              >
                <KCard
                  class="mt-4"
                >
                  <div class="columns">
                    <DefinitionCard>
                      <template #title>
                        {{ t('data-planes.routes.item.mtls.expiration_time.title') }}
                      </template>

                      <template #body>
                        {{ t('common.formats.datetime', { value: Date.parse(mTLS.certificateExpirationTime) }) }}
                      </template>
                    </DefinitionCard>

                    <DefinitionCard>
                      <template #title>
                        {{ t('data-planes.routes.item.mtls.generation_time.title') }}
                      </template>

                      <template #body>
                        {{ t('common.formats.datetime', { value: Date.parse(mTLS.lastCertificateRegeneration) }) }}
                      </template>
                    </DefinitionCard>

                    <DefinitionCard>
                      <template #title>
                        {{ t('data-planes.routes.item.mtls.regenerations.title') }}
                      </template>

                      <template #body>
                        {{ t('common.formats.integer', {value: mTLS.certificateRegenerations}) }}
                      </template>
                    </DefinitionCard>
                    <DefinitionCard>
                      <template #title>
                        {{ t('data-planes.routes.item.mtls.issued_backend.title') }}
                      </template>

                      <template #body>
                        {{ mTLS.issuedBackend }}
                      </template>
                    </DefinitionCard>

                    <DefinitionCard>
                      <template #title>
                        {{ t('data-planes.routes.item.mtls.supported_backends.title') }}
                      </template>

                      <template #body>
                        <ul>
                          <li
                            v-for="item in mTLS.supportedBackends"
                            :key="item"
                          >
                            {{ item }}
                          </li>
                        </ul>
                      </template>
                    </DefinitionCard>
                  </div>
                </KCard>
              </template>
            </template>

            <template
              v-else
            >
              <KAlert
                class="mt-4"
                appearance="warning"
              >
                <div v-html="t('data-planes.routes.item.mtls.disabled')" />
              </KAlert>
            </template>
          </div>

          <div
            v-if="props.data.dataplaneInsight.subscriptions.length > 0"
            data-testid="dataplane-subscriptions"
          >
            <h2>{{ t('data-planes.routes.item.subscriptions.title') }}</h2>

            <KCard class="mt-4">
              <SubscriptionList :subscriptions="props.data.dataplaneInsight.subscriptions" />
            </KCard>
          </div>
        </div>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { KUI_COLOR_BACKGROUND_NEUTRAL, KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { InfoIcon, ForwardIcon, GatewayIcon, RefreshIcon } from '@kong/icons'
import { computed } from 'vue'

import type { DataplaneOverview, DataplaneInbound } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import ConnectionCard from '@/app/connections/components/connection-traffic/ConnectionCard.vue'
import ConnectionGroup from '@/app/connections/components/connection-traffic/ConnectionGroup.vue'
import ConnectionTraffic from '@/app/connections/components/connection-traffic/ConnectionTraffic.vue'
import type { TrafficEntry } from '@/app/connections/data'
import type { StatsSource } from '@/app/connections/sources'
import SubscriptionList from '@/app/subscriptions/components/SubscriptionList.vue'
import { useRoute } from '@/app/vue'

const _route = useRoute()

const props = defineProps<{
  data: DataplaneOverview
}>()

const warnings = computed(() => props.data.warnings.concat(...(props.data.isCertExpired ? [{ kind: 'CERT_EXPIRED' }] : [])))
</script>

<style lang="scss" scoped>
.service-traffic-group:not(.type-passthrough) .service-traffic-card {
  cursor: pointer;
}
.traffic {
  padding: 0;
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

.status-with-reason {
  display: flex;
  align-items: center;
  gap: $kui-space-50;
}

.reason-tooltip :deep(.kong-icon) {
  display: flex;
  align-items: center;
}

.inbound-list>*+* {
  margin-block-start: $kui-space-60;
  border-top: $kui-border-width-10 solid $kui-color-border;
  padding-block-start: $kui-space-60;
}
</style>
