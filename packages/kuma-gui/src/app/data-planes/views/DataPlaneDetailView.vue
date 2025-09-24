<template>
  <RouteView
    :params="{
      inactive: Boolean,
      mesh: '',
      proxy: '',
      proxyType: '',
      subscription: '',
    }"
    name="data-plane-detail-view"
    v-slot="{ route, t, can, uri }"
  >
    <AppView
      :notifications="true"
    >
      <template
        v-for="{ bool, key, params, variant } in [
          {
            bool: props.data.dataplaneInsight.version?.kumaDp?.kumaCpCompatible === false,
            key: 'dp-cp-incompatible',
            params: {
              kumaDp: props.data.dataplaneInsight.version?.kumaDp.version ?? '',
            },
          },
          {
            bool: props.data.dataplaneInsight.version?.envoy?.kumaDpCompatible === false,
            key: 'envoy-dp-incompatible',
            params: {
              envoy: props.data.dataplaneInsight.version?.envoy.version ?? '',
              kumaDp: props.data.dataplaneInsight.version?.kumaDp.version ?? '',
            },
          },
          {
            bool: !!(can('use zones') && props.data.zone && props.data.dataplaneInsight.version?.kumaDp?.kumaCpCompatible === false),
            key: 'dp-zone-cp-incompatible',
            params: {
              kumaDp: props.data.dataplaneInsight.version?.kumaDp.version ?? '',
            },
          },
          {
            bool: props.data.isCertExpiresSoon,
            key: 'certificate-expires-soon',
          },
          {
            bool: props.data.isCertExpired,
            key: 'certificate-expired',
          },
          {
            bool: !props.data.dataplaneInsight.mTLS,
            key: 'no-mtls',
          },
          {
            bool: !can('use transparent-proxying', props.data),
            key: 'networking-transparent-proxying',
            variant: 'info' as const,
          },
        ]"
        :key="key"
      >
        <XNotification
          :notify="bool"
          :data-testid="`warning-${key}`"
          :uri="`data-planes.notifications.${key}.${props.data.id}`"
          :variant="variant"
        >
          <XI18n
            :path="`data-planes.notifications.${key}`"
            :params="Object.fromEntries(Object.entries(params ?? {}))"
          />
        </XNotification>
      </template>

      <XLayout
        type="stack"
        data-testid="dataplane-details"
      >
        <XAboutCard
          :title="t('data-planes.routes.item.about.title')"
          :created="props.data.creationTime"
          :modified="props.data.modificationTime"
          class="about-section"
        >
          <XLayout>
            <XDl
              variant="x-stack"
            >
              <div>
                <dt>
                  {{ t('http.api.property.status') }}
                </dt>
                <dd>
                  <XLayout
                    type="separated"
                  >
                    <StatusBadge :status="props.data.status" />
                    <DataCollection
                      v-if="props.data.dataplaneType === 'standard'"
                      :items="props.data.dataplane.networking.inbounds"
                      :predicate="item => item.state !== 'Ready'"
                      :empty="false"
                      v-slot="{ items: unhealthyInbounds }"
                    >
                      <XIcon name="info">
                        <ul>
                          <li
                            v-for="inbound in unhealthyInbounds"
                            :key="`${inbound.service}:${inbound.port}`"
                          >
                            {{ t('data-planes.routes.item.unhealthy_inbound', { port: inbound.port }) }}
                          </li>
                        </ul>
                      </XIcon>
                    </DataCollection>
                  </XLayout>
                </dd>
              </div>
              <div
                v-if="can('use zones') && props.data.zone"
              >
                <dt>
                  {{ t('http.api.property.zone') }}
                </dt>
                <dd>
                  <XBadge appearance="decorative">
                    <XAction
                      :to="{
                        name: 'zone-cp-detail-view',
                        params: {
                          zone: props.data.zone,
                        },
                      }"
                    >
                      {{ props.data.zone }}
                    </XAction>
                  </XBadge>
                </dd>
              </div>
              <div>
                <dt>
                  {{ t('http.api.property.type') }}
                </dt>
                <dd>
                  <XBadge appearance="decorative">
                    {{ t(`data-planes.type.${props.data.dataplaneType}`) }}
                  </XBadge>
                </dd>
              </div>
              <div
                v-if="props.data.namespace.length > 0"
              >
                <dt>
                  {{ t('http.api.property.namespace') }}
                </dt>
                <dd>
                  <XBadge
                    appearance="decorative"
                  >
                    {{ props.data.namespace }}
                  </XBadge>
                </dd>
              </div>
              <div>
                <dt>
                  {{ t('http.api.property.address') }}
                </dt>
                <dd>
                  <XCopyButton
                    variant="badge"
                    format="default"
                    :text="`${props.data.dataplane.networking.address}`"
                  />
                </dd>
              </div>
              <div
                v-if="props.data.dataplane.networking.gateway"
              >
                <dt>
                  {{ t('http.api.property.tags') }}
                </dt>
                <dd>
                  <TagList
                    :tags="props.data.dataplane.networking.gateway.tags"
                  />
                </dd>
              </div>
            </XDl>

            <XLayout
              v-if="props.data.dataplaneInsight.mTLS"
              data-testid="dataplane-mtls"
              class="about-subsection"
              size="small"
            >
              <h3>{{ t('data-planes.routes.item.mtls.title') }}</h3>
              <XLayout size="small">
                <template
                  v-for="mTLS in [props.data.dataplaneInsight.mTLS]"
                  :key="typeof mTLS"
                >
                  <XDl
                    v-if="typeof mTLS.lastCertificateRegeneration !== 'undefined' && typeof mTLS.certificateExpirationTime !== 'undefined' && typeof mTLS.issuedBackend !== 'undefined'"
                    variant="x-stack"
                  >
                    <div>
                      <dt>
                        {{ t('data-planes.routes.item.mtls.generation_time.title') }}
                      </dt>
                      <dd>
                        <XBadge appearance="neutral">
                          {{ t('common.formats.datetime', { value: Date.parse(mTLS.lastCertificateRegeneration) }) }}
                        </XBadge>
                      </dd>
                    </div>
                    <div>
                      <dt>
                        {{ t('data-planes.routes.item.mtls.expiration_time.title') }}
                      </dt>
                      <dd>
                        <XBadge appearance="neutral">
                          {{ t('common.formats.datetime', { value: Date.parse(mTLS.certificateExpirationTime) }) }}
                        </XBadge>
                      </dd>
                    </div>
                  </XDl>
                  <XI18n
                    v-else
                    path="data-planes.routes.item.mtls.managed_externally"
                  />
                  <XDl
                    variant="x-stack"
                  >
                    <div
                      v-if="typeof mTLS.certificateRegenerations !== 'undefined'"
                    >
                      <dt>
                        {{ t('data-planes.routes.item.mtls.regenerations.title') }}
                      </dt>
                      <dd>
                        <XBadge appearance="info">
                          {{ t('common.formats.integer', { value: mTLS.certificateRegenerations }) }}
                        </XBadge>
                      </dd>
                    </div>
                    <div
                      v-if="typeof mTLS.issuedBackend !== 'undefined'"
                    >
                      <dt>
                        {{ t('data-planes.routes.item.mtls.issued_backend.title') }}
                      </dt>
                      <dd>
                        <XBadge appearance="decorative">
                          {{ mTLS.issuedBackend }}
                        </XBadge>
                      </dd>
                    </div>
                    <div
                      v-if="typeof mTLS.supportedBackends !== 'undefined'"
                    >
                      <dt>
                        {{ t('data-planes.routes.item.mtls.supported_backends.title') }}
                      </dt>
                      <dd>
                        <XLayout
                          type="separated"
                          truncate
                        >
                          <XBadge
                            v-for="item in mTLS.supportedBackends"
                            :key="item"
                            :appearance="item === mTLS.issuedBackend ? 'decorative' : 'info'"
                          >
                            {{ item }}
                          </XBadge>
                        </XLayout>
                      </dd>
                    </div>
                  </XDl>
                </template>
              </XLayout>
            </XLayout>

            <XLayout
              v-if="props.data.dataplaneInsight.subscriptions.length > 0"
              data-testid="about-dataplane-subscriptions"
              class="about-subsection"
            >
              <XLayout type="separated">
                <h3>{{ t('data-planes.routes.item.subscriptions.title') }}</h3>
                <XAction
                  appearance="anchor"
                  :to="{
                    name: 'data-plane-subscriptions-summary-view',
                    params: {
                      mesh: route.params.mesh,
                      proxy: route.params.proxy,
                    },
                    query: {
                      inactive: route.params.inactive,
                    },
                  }"
                >
                  ({{ t('data-planes.routes.item.xds.show-details') }})
                </XAction>
              </XLayout>

              <XDl
                v-if="props.data.dataplaneInsight.connectedSubscription"
                variant="x-stack"
              >
                <div>
                  <dt>
                    {{ t('data-planes.routes.item.xds.connected') }}
                  </dt>
                  <dd>
                    <XBadge appearance="neutral">
                      {{ t('common.formats.datetime', { value: Date.parse(props.data.dataplaneInsight.connectedSubscription.connectTime ?? '') }) }}
                    </XBadge>
                  </dd>
                </div>
                <div>
                  <dt>
                    {{ t('data-planes.routes.item.xds.instance') }}
                  </dt>
                  <dd>
                    <XBadge>
                      {{ props.data.dataplaneInsight.connectedSubscription.controlPlaneInstanceId }}
                    </XBadge>
                  </dd>
                </div>
                <div>
                  <dt>
                    {{ t('data-planes.routes.item.xds.version') }}
                  </dt>
                  <dd>
                    <XBadge>
                      {{ props.data.dataplaneInsight.connectedSubscription.version?.kumaDp?.version ?? t('common.unknown') }}
                    </XBadge>
                  </dd>
                </div>
              </XDl>
              <template v-else>
                <XI18n path="data-planes.routes.item.xds.disconnected" />
              </template>
            </XLayout>

            <DataSource
              :src="uri(policySources, '/meshes/:mesh/dataplanes/:name/policies/for/proxy', {
                mesh: route.params.mesh,
                name: route.params.proxy,
              })"
              @change="(res) => resources = res"
            >
              <XLayout
                v-if="resources?.policies.length"
                data-testid="about-dataplane-policies"
                class="about-subsection"
              >
                <h3>{{ t('data-planes.routes.item.policies') }}</h3>

                <XLayout
                  type="separated"
                >
                  <template
                    v-for="policy in resources?.policies"
                    :key="policy.kind"
                  >
                    <XAction
                      :to="{
                        name: 'data-plane-policy-config-summary-view',
                        params: {
                          mesh: route.params.mesh,
                          proxy: route.params.proxy,
                          policy: policy.kind.toLowerCase(),
                        },
                      }"
                    >
                      <XBadge>
                        {{ policy.kind }}
                      </XBadge>
                    </XAction>
                  </template>
                </XLayout>
              </XLayout>
            </DataSource>
          </XLayout>
        </XAboutCard>

        <DataSource
          :src="uri(sources, '/meshes/:mesh/dataplanes/:name/layout', {
            mesh: route.params.mesh,
            name: route.params.proxy,
          })"
          v-slot="{ data: dataplaneLayout, refresh, error }"
        >
          <DataSource
            :src="uri(connectionSources, '/connections/stats/for/:proxyType/:name/:mesh/:socketAddress', {
              proxyType: ({ ingresses: 'zone-ingress', egresses: 'zone-egress' })[route.params.proxyType] ?? 'dataplane',
              name: route.params.proxy,
              mesh: route.params.mesh || '*',
              // 'self_inbound' can be used as socket address to filter the stats as the contextual kri of an inbound always starts with 'self_inbound'
              socketAddress: 'self_inbound',
            })"
            v-slot="{ data: traffic, error: trafficError, refresh: refreshTraffic }"
          >
            <XCard
              class="traffic"
              data-testid="dataplane-traffic"
            >
              <DataLoader
                :data="[dataplaneLayout, traffic]"
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
                      v-for="(inboundsByPort, port) in [Object.groupBy(props.data.dataplane.networking.inbounds, (item) => item.port)]"
                      :key="port"
                    >
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
                                  <template
                                    v-for="inbound in [inboundsByPort[item.port]?.[0]]"
                                    :key="inbound?.port"
                                  >
                                    <ConnectionCard
                                      data-testid="dataplane-inbound"
                                      :protocol="item.protocol"
                                      :port-name="inbound?.portName"
                                      :traffic="traffic?.inbounds[item.proxyResourcePortName]"
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
                                          name: ((name) => name.includes('bound') ? name.replace('-outbound-', '-inbound-') : 'data-plane-connection-inbound-summary-overview-view')(String(_route.name)),
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
                            </template>
                          </DataCollection>
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
                                :port-name="Kri.fromString(outbound.proxyResourceName).sectionName"
                                :traffic="traffic?.outbounds[outbound.proxyResourceName]"
                                data-actionable
                              >
                                <XAction
                                  data-action
                                  :to="{
                                    name: ((name) => name.includes('bound') ? name.replace('-inbound-', '-outbound-') : 'data-plane-connection-outbound-summary-overview-view')(String(_route.name)),
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
                  route.replace({
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
                  :data="route.params.subscription.length > 0 ? props.data.dataplaneInsight.subscriptions : (child.route.name as string).includes('-inbound-') ? dataplaneLayout?.inbounds : dataplaneLayout?.outbounds"
                  :data-plane-overview="props.data"
                  :networking="props.data.dataplane.networking"
                  :subscriptions="props.data.dataplaneInsight.subscriptions"
                  :policies="resources?.policies"
                />
              </XDrawer>
            </RouterView>
          </DataSource>
        </DataSource>
      </XLayout>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_40 } from '@kong/design-tokens'
import { ref } from 'vue'

import { sources } from '../sources'
import StatusBadge from '@/app/common/StatusBadge.vue'
import TagList from '@/app/common/TagList.vue'
import ConnectionCard from '@/app/connections/components/connection-traffic/ConnectionCard.vue'
import ConnectionGroup from '@/app/connections/components/connection-traffic/ConnectionGroup.vue'
import ConnectionTraffic from '@/app/connections/components/connection-traffic/ConnectionTraffic.vue'
import { sources as connectionSources } from '@/app/connections/sources'
import type { DataplaneOverview } from '@/app/data-planes/data'
import { Kri } from '@/app/kuma'
import type { Mesh } from '@/app/meshes/data'
import type { DataplanePolicies } from '@/app/policies/data/DataplanePolicies'
import { sources as policySources } from '@/app/policies/sources'
import { useRoute } from '@/app/vue'

const _route = useRoute()

const props = defineProps<{
  data: DataplaneOverview
  mesh: Mesh
}>()

const resources = ref<DataplanePolicies | undefined>()
</script>

<style lang="scss" scoped>
.service-traffic-group:not(.type-passthrough) .service-traffic-card {
  cursor: pointer;
}

.traffic {
  padding: 0;
  contain: content;
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

.about-subsection {
  border-top: $kui-border-width-10 solid $kui-color-border;
  padding-top: $kui-space-70;
}

:deep(.about-section .about-section-content) {
  display: block !important;

  h3 {
    color: $kui-color-text;
  }
}
</style>
