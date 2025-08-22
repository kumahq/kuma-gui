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
    <DataSource
      :src="uri(policySources, '/meshes/:mesh/dataplanes/:name/policies/for/proxy', {
        mesh: route.params.mesh,
        name: route.params.proxy,
      })"
      v-slot="{ data: dataplanePolicies }"
    >
      <DataSource
        :src="uri(sources, '/meshes/:mesh/dataplanes/:name/layout', {
          mesh: route.params.mesh,
          name: route.params.proxy,
        })"
        v-slot="{ data: dataplaneLayout, refresh, error }"
      >
        <DataSource
          :src="uri(policySources, '/policy-types', {})"
          v-slot="{ data: policyTypesData }"
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
            <DataLoader
              :data="[dataplaneLayout, dataplanePolicies, policyTypesData, traffic]"
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
                      <XLayout
                        type="separated"
                      >
                        <DefinitionCard
                          layout="horizontal"
                        >
                          <template
                            #title
                          >
                            {{ t('http.api.property.status') }}
                          </template>

                          <template
                            #body
                          >
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
                                      {{ t('data-planes.routes.item.unhealthy_inbound', { service: inbound.service, port: inbound.port }) }}
                                    </li>
                                  </ul>
                                </XIcon>
                              </DataCollection>
                            </XLayout>
                          </template>
                        </DefinitionCard>

                        <DefinitionCard
                          v-if="can('use zones') && props.data.zone"
                          layout="horizontal"
                        >
                          <template
                            #title
                          >
                            {{ t('http.api.property.zone') }}
                          </template>
                          <template
                            #body
                          >
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
                          </template>
                        </DefinitionCard>
                        <DefinitionCard layout="horizontal">
                          <template
                            #title
                          >
                            {{ t('http.api.property.type') }}
                          </template>

                          <template
                            #body
                          >
                            <XBadge appearance="decorative">
                              {{ t(`data-planes.type.${props.data.dataplaneType}`) }}
                            </XBadge>
                          </template>
                        </DefinitionCard>

                        <DefinitionCard
                          v-if="props.data.namespace.length > 0"
                          layout="horizontal"
                        >
                          <template
                            #title
                          >
                            {{ t('http.api.property.namespace') }}
                          </template>

                          <template
                            #body
                          >
                            <XBadge
                              appearance="decorative"
                            >
                              {{ props.data.namespace }}
                            </XBadge>
                          </template>
                        </DefinitionCard>

                        <DefinitionCard
                          layout="horizontal"
                        >
                          <template
                            #title
                          >
                            {{ t('http.api.property.address') }}
                          </template>

                          <template
                            #body
                          >
                            <XCopyButton
                              variant="badge"
                              format="default"
                              :text="`${props.data.dataplane.networking.address}`"
                            />
                          </template>
                        </DefinitionCard>

                        <template
                          v-if="props.data.dataplane.networking.gateway"
                        >
                          <DefinitionCard
                            layout="horizontal"
                          >
                            <template
                              #title
                            >
                              {{ t('http.api.property.tags') }}
                            </template>

                            <template
                              #body
                            >
                              <TagList
                                :tags="props.data.dataplane.networking.gateway.tags"
                              />
                            </template>
                          </DefinitionCard>
                        </template>
                      </XLayout>

                      <XLayout
                        v-if="props.data.dataplaneInsight.mTLS"
                        data-testid="dataplane-mtls"
                        class="about-subsection"
                        size="small"
                      >
                        <h3>{{ t('data-planes.routes.item.mtls.title') }}</h3>
                        <XLayout size="small">
                          <template
                            v-for="mTLS in [
                              props.data.dataplaneInsight.mTLS,
                            ]"
                            :key="mTLS"
                          >
                            <XLayout type="separated">
                              <template v-if="typeof mTLS.lastCertificateRegeneration !== 'undefined' && typeof mTLS.certificateExpirationTime !== 'undefined' && typeof mTLS.issuedBackend !== 'undefined'">
                                <DefinitionCard layout="horizontal">
                                  <template #title>
                                    <XI18n
                                      path="data-planes.routes.item.mtls.generation_time.title"
                                    />
                                  </template>

                                  <template #body>
                                    <XBadge appearance="neutral">
                                      {{ t('common.formats.datetime', { value: Date.parse(mTLS.lastCertificateRegeneration) }) }}
                                    </XBadge>
                                  </template>
                                </DefinitionCard>
                                <DefinitionCard layout="horizontal">
                                  <template #title>
                                    <XI18n
                                      path="data-planes.routes.item.mtls.expiration_time.title"
                                    />
                                  </template>

                                  <template #body>
                                    <XBadge appearance="neutral">
                                      {{ t('common.formats.datetime', { value: Date.parse(mTLS.certificateExpirationTime) }) }}
                                    </XBadge>
                                  </template>
                                </DefinitionCard>
                              </template>
                              <template v-else>
                                <XI18n
                                  path="data-planes.routes.item.mtls.managed_externally"
                                />
                              </template>
                            </XLayout>
                            <XLayout type="separated">
                              <DefinitionCard
                                v-if="typeof mTLS.certificateRegenerations !== 'undefined'"
                                layout="horizontal"
                              >
                                <template
                                  #title
                                >
                                  {{ t('data-planes.routes.item.mtls.regenerations.title') }}
                                </template>

                                <template
                                  #body
                                >
                                  <XBadge appearance="info">
                                    {{ t('common.formats.integer', { value: mTLS.certificateRegenerations }) }}
                                  </XBadge>
                                </template>
                              </DefinitionCard>

                              <DefinitionCard
                                v-if="mTLS.issuedBackend"
                                layout="horizontal"
                              >
                                <template
                                  #title
                                >
                                  {{ t('data-planes.routes.item.mtls.issued_backend.title') }}
                                </template>

                                <template
                                  #body
                                >
                                  <XBadge appearance="decorative">
                                    {{ mTLS.issuedBackend }}
                                  </XBadge>
                                </template>
                              </DefinitionCard>

                              <DefinitionCard
                                v-if="typeof mTLS.supportedBackends !== 'undefined'"
                                layout="horizontal"
                              >
                                <template
                                  #title
                                >
                                  {{ t('data-planes.routes.item.mtls.supported_backends.title') }}
                                </template>

                                <template
                                  #body
                                >
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
                                </template>
                              </DefinitionCard>
                            </XLayout>
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
                            data-action
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

                        <XLayout
                          v-for="subscriptions in [[...props.data.dataplaneInsight.subscriptions].reverse()]"
                          :key="typeof subscriptions"
                          type="separated"
                        >
                          <template
                            v-for="subscription in [subscriptions.find((sub) => !sub.disconnectTime) ?? subscriptions[0]]"
                            :key="subscription.id"
                          >
                            <template v-if="!subscription.disconnectTime && subscription.connectTime">
                              <DefinitionCard layout="horizontal">
                                <template #title>
                                  <XI18n
                                    path="data-planes.routes.item.xds.connected"
                                  />
                                </template>

                                <template #body>
                                  <XBadge appearance="neutral">
                                    {{ t('common.formats.datetime', { value: Date.parse(subscription.connectTime) }) }}
                                  </XBadge>
                                </template>
                              </DefinitionCard>
                              <DefinitionCard layout="horizontal">
                                <template #title>
                                  <XI18n
                                    path="data-planes.routes.item.xds.instance"
                                  />
                                </template>

                                <template #body>
                                  <XBadge appearance="info">
                                    {{ subscription.controlPlaneInstanceId }}
                                  </XBadge>
                                </template>
                              </DefinitionCard>
                              <DefinitionCard layout="horizontal">
                                <template #title>
                                  <XI18n
                                    path="data-planes.routes.item.xds.version"
                                  />
                                </template>

                                <template #body>
                                  <XBadge appearance="info">
                                    {{ subscription.version?.kumaDp?.version ?? t('common.unknown') }}
                                  </XBadge>
                                </template>
                              </DefinitionCard>
                            </template>
                            <template v-else>
                              <XI18n path="data-planes.routes.item.xds.disconnected" />
                            </template>
                          </template>
                        </XLayout>
                      </XLayout>

                      <XLayout
                        v-if="dataplanePolicies?.policies.length"
                        data-testid="about-dataplane-policies"
                        class="about-subsection"
                      >
                        <h3>{{ t('data-planes.routes.item.policies') }}</h3>

                        <XLayout
                          type="separated"
                        >
                          <template
                            v-for="policy in dataplanePolicies?.policies"
                            :key="policy.kind"
                          >
                            <XAction
                              data-action
                              appearance="anchor"
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
                    </XLayout>
                  </XAboutCard>

                  <XCard
                    class="traffic"
                    data-testid="dataplane-traffic"
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
                                      :port-name="Kri.fromString(item.proxyResourceName).sectionName"
                                      :traffic="traffic?.inbounds[Kri.toString({ ...Kri.fromString(item.proxyResourceName), sectionName: item.port.toString() })]"
                                    >
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
                  </XCard>

                  <RouterView
                    v-slot="child"
                  >
                    <SummaryView
                      v-if="child.route.name !== route.name"
                      :width="child.route.name === 'data-plane-subscriptions-summary-view' ? '900px' : '670px'"
                      @close="function () {
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
                        :policies="dataplanePolicies?.policies ?? []"
                        :policy-types-data="policyTypesData"
                      />
                    </SummaryView>
                  </RouterView>
                </XLayout>
              </AppView>
            </DataLoader>
          </DataSource>
        </DataSource>
      </DataSource>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { provide } from 'vue'

import { sources } from '../sources'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import TagList from '@/app/common/TagList.vue'
import ConnectionCard from '@/app/connections/components/connection-traffic/ConnectionCard.vue'
import ConnectionGroup from '@/app/connections/components/connection-traffic/ConnectionGroup.vue'
import ConnectionTraffic from '@/app/connections/components/connection-traffic/ConnectionTraffic.vue'
import { sources as connectionSources } from '@/app/connections/sources'
import type { DataplaneOverview } from '@/app/data-planes/data'
import { Kri } from '@/app/kuma/kri'
import type { Mesh } from '@/app/meshes/data'
import { sources as policySources } from '@/app/policies/sources'
import { useRoute } from '@/app/vue'

const _route = useRoute()

const props = defineProps<{
  data: DataplaneOverview
  mesh: Mesh
}>()
provide('data-plane-overview', props.data)
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
