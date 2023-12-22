<template>
  <RouteView
    v-slot="{ can, route }"
    :params="{
      mesh: '',
      dataPlane: '',
    }"
    name="data-plane-detail-view"
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

        <DataSource
          v-if="can('read traffic') && props.data.dataplaneType === 'standard'"
          v-slot="{ data: traffic, error, refresh }: TrafficSource"
          :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/traffic`"
        >
          <ErrorBlock
            v-if="error"
            :error="error"
          />

          <LoadingBlock v-else-if="traffic === undefined" />

          <KCard
            v-else
            class="traffic"
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
                    v-for="item in traffic.inbounds"
                    :key="`${item.name}`"
                  >
                    <template
                      v-for="meta in [
                        {
                          protocol: (typeof item.http !== 'undefined' ? 'http' : 'tcp') as 'http' | 'tcp',
                          direction: 'downstream',
                        },
                      ]"
                      :key="meta.protocol"
                    >
                      <!-- rx and tx are purposefully reversed to rx=tx and tx=rx here due to the direction of the traffic (downstream) -->
                      <ServiceTrafficCard
                        :protocol="meta.protocol"
                        :rx="item[meta.protocol]?.[`${meta.direction}_cx_tx_bytes_total`] as (number | undefined)"
                        :tx="item[meta.protocol]?.[`${meta.direction}_cx_rx_bytes_total`] as (number | undefined)"
                        :requests="meta.protocol === 'http' ? ['http1_total', 'http2_total', 'http3_total'].reduce((prev, key) => prev + (item.http?.[`${meta.direction}_rq_${key}`] as (number | undefined) ?? 0), 0) : undefined"
                      >
                        {{ item.name }}
                      </ServiceTrafficCard>
                    </template>
                  </template>
                </ServiceTrafficGroup>
              </DataPlaneTraffic>
              <DataPlaneTraffic>
                <template #actions>
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
                <template #data>
                  <dl>
                    <div>
                      <dt class="passthrough">
                        {{ t('services.components.service_traffic.passthrough', {}, {defaultMessage: 'Passthrough Requests'}) }}
                      </dt>
                      <dd>{{ t('common.formats.integer', {value: 1000}) }}</dd>
                    </div>
                    <div>
                      <dt class="outbounds">
                        {{ t('services.components.service_traffic.mesh', {}, {defaultMessage: 'Mesh Requests'}) }}
                      </dt>
                      <dd>{{ t('common.formats.integer', {value: 1000}) }}</dd>
                    </div>
                  </dl>
                </template>
                <ServiceTrafficGroup
                  type="passthrough"
                >
                  <template
                    v-for="meta in [
                      {
                        protocol: 'cluster',
                        direction: 'downstream',
                      },
                    ]"
                    :key="meta.protocol"
                  >
                    <!-- rx and tx are purposefully reversed to rx=tx and tx=rx here due to the direction of the traffic (downstream) -->
                    <ServiceTrafficCard
                      :protocol="`unknown`"
                      :rx="traffic.passthrough.reduce((prev: number, item: any) => prev + (item[meta.protocol]?.[`${meta.direction}_cx_tx_bytes_total`] ?? 0), 0)"
                      :tx="traffic.passthrough.reduce((prev: number, item: any) => prev + (item[meta.protocol]?.[`${meta.direction}_cx_rx_bytes_total`] ?? 0), 0)"
                    >
                      Non mesh traffic
                    </ServiceTrafficCard>
                  </template>
                </ServiceTrafficGroup>
                <ServiceTrafficGroup
                  type="outbound"
                >
                  <template
                    v-for="item in traffic.outbounds"
                    :key="`${item.name}`"
                  >
                    <template
                      v-for="meta in [
                        {
                          protocol: (typeof item.http !== 'undefined' ? 'http' : 'tcp') as 'http' | 'tcp',
                          direction: 'downstream',
                        },
                      ]"
                      :key="meta.protocol"
                    >
                      <!-- rx and tx are purposefully reversed to rx=tx and tx=rx here due to the direction of the traffic (downstream) -->
                      <ServiceTrafficCard
                        :protocol="meta.protocol"
                        :rx="item[meta.protocol]?.[`${meta.direction}_cx_tx_bytes_total`] as (number | undefined)"
                        :tx="item[meta.protocol]?.[`${meta.direction}_cx_rx_bytes_total`] as (number | undefined)"
                        :requests="meta.protocol === 'http' ? ['http1_total', 'http2_total', 'http3_total'].reduce((prev, key) => prev + (item.http?.[`${meta.direction}_rq_${key}`] as (number | undefined) ?? 0), 0) : undefined"
                      >
                        {{ item.name }}
                      </ServiceTrafficCard>
                    </template>
                  </template>
                </ServiceTrafficGroup>
              </DataPlaneTraffic>
            </div>
          </KCard>
        </DataSource>

        <div
          v-if="props.data.dataplane.networking.inbounds.length > 0"
          data-testid="dataplane-inbounds"
        >
          <h2>{{ t('data-planes.routes.item.inbounds') }}</h2>

          <KCard class="mt-4">
            <div class="inbound-list">
              <div
                v-for="(inbound, index) in props.data.dataplane.networking.inbounds"
                :key="index"
                class="inbound"
              >
                <h4>
                  <TextWithCopyButton :text="inbound.tags['kuma.io/service']">
                    {{ t('data-planes.routes.item.inbound_name', { service: inbound.tags['kuma.io/service'] }) }}
                  </TextWithCopyButton>
                </h4>

                <div class="mt-4 columns">
                  <DefinitionCard>
                    <template #title>
                      {{ t('http.api.property.status') }}
                    </template>

                    <template #body>
                      <KBadge
                        v-if="inbound.health.ready"
                        appearance="success"
                      >
                        {{ t('data-planes.routes.item.health.ready') }}
                      </KBadge>

                      <KBadge
                        v-else
                        appearance="danger"
                      >
                        {{ t('data-planes.routes.item.health.not_ready') }}
                      </KBadge>
                    </template>
                  </DefinitionCard>

                  <DefinitionCard>
                    <template #title>
                      {{ t('http.api.property.tags') }}
                    </template>

                    <template #body>
                      <TagList :tags="inbound.tags" />
                    </template>
                  </DefinitionCard>

                  <DefinitionCard>
                    <template #title>
                      {{ t('http.api.property.address') }}
                    </template>

                    <template #body>
                      <TextWithCopyButton :text="inbound.addressPort" />
                    </template>
                  </DefinitionCard>

                  <DefinitionCard>
                    <template #title>
                      {{ t('http.api.property.serviceAddress') }}
                    </template>

                    <template #body>
                      <TextWithCopyButton :text="inbound.serviceAddressPort" />
                    </template>
                  </DefinitionCard>
                </div>
              </div>
            </div>
          </KCard>
        </div>

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
  </RouteView>
</template>

<script lang="ts" setup>
import { KUI_COLOR_BACKGROUND_NEUTRAL, KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { InfoIcon, ForwardIcon, GatewayIcon, RefreshIcon } from '@kong/icons'
import { computed } from 'vue'

import type { DataplaneOverview } from '../data'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
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
