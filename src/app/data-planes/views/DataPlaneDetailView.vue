<template>
  <RouteView
    v-slot="{ route }"
    :params="{
      mesh: '',
      dataPlane: '',
      service: '',
      inactive: false,
    }"
    name="data-plane-detail-view"
  >
    <DataSource
      v-slot="{ data: traffic, error, refresh }: TrafficSource"
      :src="props.data.dataplaneType === 'standard' ? `/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/traffic` : ''"
    >
      <AppView>
        <template
          v-if="warnings.length > 0"
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
              Error loading outbound stats: <strong>{{ error.toString() }}</strong>
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

                    <template
                      v-for="inbounds in [props.data.dataplane.networking.inbounds.filter(item => !item.health.ready)]"
                      :key="inbounds"
                    >
                      <KTooltip
                        v-if="inbounds.length > 0"
                        class="reason-tooltip"
                        position-fixed
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
                    </template>
                  </div>
                </template>
              </DefinitionCard>

              <DefinitionCard>
                <template #title>
                  {{ t('data-planes.routes.item.last_updated') }}
                </template>

                <template #body>
                  {{ formatIsoDate(props.data.modificationTime) }}
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
            v-if="props.data.dataplaneType === 'standard'"
            class="traffic"
            data-testid="dataplane-traffic"
          >
            <div class="columns">
              <DataPlaneTraffic>
                <template #title>
                  <ForwardIcon
                    display="inline-block"
                    decorative
                    :size="KUI_ICON_SIZE_30"
                  />
                  Inbounds
                </template>
                <template #data>
                  <dl>
                    <div>
                      <dt>{{ t('services.components.service_traffic.inbound', {}, {defaultMessage: 'Requests'}) }}</dt>
                      <dd>{{ t('common.formats.integer', {value: 1000}) }}</dd>
                    </div>
                  </dl>
                </template>
                <ServiceTrafficGroup
                  type="inbound"
                >
                  <template
                    v-for="item in props.data.dataplane.networking.inbounds"
                    :key="`${item.port}`"
                  >
                    <!-- the finding here would be expensive if inbounds was commonly large -->
                    <!-- inbounds are mostly singular and even when they are not they are small -->
                    <template
                      v-for="inbound in [
                        (traffic || {inbounds: []}).inbounds.find(inbound => `${inbound.port}` === `${item.port}`),
                      ]"
                      :key="inbound"
                    >
                      <ServiceTrafficCard
                        :protocol="item.protocol"
                        :traffic="inbound"
                      >
                        <RouterLink
                          :to="{
                            name: 'data-plane-inbound-summary-overview-view',
                            params: {
                              service: item.port,
                            },
                            query: {
                              inactive: route.params.inactive ? null : undefined,
                            },
                          }"
                        >
                          :{{ item.port }}
                        </RouterLink>
                        <TagList
                          :tags="[{label: 'kuma.io/service', value: item.tags['kuma.io/service']}]"
                        />
                      </ServiceTrafficCard>
                    </template>
                  </template>
                </ServiceTrafficGroup>
              </DataPlaneTraffic>

              <DataPlaneTraffic>
                <template
                  v-if="traffic"
                  #actions
                >
                  <KInputSwitch
                    v-model="route.params.inactive"
                  >
                    <template #label>
                      Show inactive
                    </template>
                  </KInputSwitch>

                  <KButton
                    appearance="primary"
                    @click="refresh"
                  >
                    <RefreshIcon :size="KUI_ICON_SIZE_30" />

                    Refresh
                  </KButton>
                </template>
                <template #title>
                  <GatewayIcon
                    display="inline-block"
                    decorative
                    :size="KUI_ICON_SIZE_30"
                  />
                  <span>Outbounds</span>
                </template>
                <template
                  v-if="traffic"
                >
                  <ServiceTrafficGroup
                    type="passthrough"
                  >
                    <ServiceTrafficCard
                      :protocol="`passthrough`"
                      :traffic="traffic.passthrough"
                    >
                      Non mesh traffic
                    </ServiceTrafficCard>
                  </ServiceTrafficGroup>
                  <template
                    v-if="traffic.outbounds.length > 0"
                  >
                    <ServiceTrafficGroup
                      type="outbound"
                    >
                      <template
                        v-for="item in traffic.outbounds"
                        :key="`${item.name}`"
                      >
                        <ServiceTrafficCard
                          v-if="route.params.inactive || ((item.protocol === 'tcp' ? item.tcp?.downstream_cx_rx_bytes_total : item.http?.downstream_rq_total) as (number | undefined ) ?? 0 > 0)"
                          :protocol="item.protocol"
                          :traffic="item"
                        >
                          <RouterLink
                            :to="{
                              name: 'data-plane-outbound-summary-overview-view',
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
                        </ServiceTrafficCard>
                      </template>
                    </ServiceTrafficGroup>
                  </template>
                </template>
              </DataPlaneTraffic>
            </div>
          </KCard>
          <RouterView
            v-if="route.params.service && [
              traffic?.outbounds,
              props.data.dataplane.networking.inbounds,
            ].every(item => typeof item !== 'undefined')"
            v-slot="child"
          >
            <SummaryView
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
                :data="child.route.name === 'data-plane-inbound-summary-overview-view' ?
                  props.data.dataplane.networking.inbounds.find((item) => `${item.port}` === route.params.service) :
                  traffic!.outbounds.find((item) => {
                    return item.name === route.params.service
                  })
                "
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
                        {{ formatIsoDate(mTLS.certificateExpirationTime) }}
                      </template>
                    </DefinitionCard>

                    <DefinitionCard>
                      <template #title>
                        {{ t('data-planes.routes.item.mtls.generation_time.title') }}
                      </template>

                      <template #body>
                        {{ formatIsoDate(mTLS.lastCertificateRegeneration) }}
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
                <template #alertMessage>
                  <div
                    v-html="t('data-planes.routes.item.mtls.disabled')"
                  />
                </template>
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

import type { DataplaneOverview } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import TagList from '@/app/common/TagList.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import DataPlaneTraffic from '@/app/data-planes/components/data-plane-traffic/DataPlaneTraffic.vue'
import ServiceTrafficCard from '@/app/data-planes/components/data-plane-traffic/ServiceTrafficCard.vue'
import ServiceTrafficGroup from '@/app/data-planes/components/data-plane-traffic/ServiceTrafficGroup.vue'
import type { TrafficSource } from '@/app/data-planes/sources'
import SubscriptionList from '@/app/subscriptions/components/SubscriptionList.vue'
import { useI18n } from '@/utilities'

const { t, formatIsoDate } = useI18n()

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
