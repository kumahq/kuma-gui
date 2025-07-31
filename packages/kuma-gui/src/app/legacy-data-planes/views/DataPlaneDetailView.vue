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
    v-slot="{ route, t, can, me, uri }"
  >
    <DataSource
      :src="uri(sources, '/connections/stats/for/:proxyType/:name/:mesh/:socketAddress', {
        proxyType: ({ ingresses: 'zone-ingress', egresses: 'zone-egress' })[route.params.proxyType] ?? 'dataplane',
        name: route.params.proxy,
        mesh: route.params.mesh || '*',
        socketAddress: props.data.dataplane.networking.inboundAddress,
      })"
      v-slot="{ data: traffic, error, refresh }"
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
              bool: !!error,
              key: 'stats-not-enhanced',
              params: {
                error: error?.toString() ?? '',
              },
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
                    {{ t('http.api.proptery.type') }}
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
                class="dataplane-mtls"
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
                    </XLayout>
                    <XLayout type="separated">
                      <DefinitionCard layout="horizontal">
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

                      <DefinitionCard layout="horizontal">
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

                      <DefinitionCard layout="horizontal">
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
                <!-- if we are a builtin gateway proxy i.e. a 'gateway' proxy -->
                <!-- use its first and only inbounds as a template  -->
                <!-- and fill the inbounds out from the stats once they are loaded -->
                <template
                  v-for="inbounds in [props.data.dataplane.networking.type === 'gateway' ? Object.entries<any>(traffic?.inbounds ?? {}).reduce<DataplaneInbound[]>((prev, [key, value]) => {
                    // As we are just 'finding' inbounds from stats without knowing them
                    // from the dataplane overview API request, we will wrongly 'find'
                    // the envoy admin inbound that is used for kumas /stats API. Ignore
                    // the envoy admin inbound when we find it
                    const port = key.split('_').at(-1)
                    if (port === (props.data.dataplane.networking.admin?.port ?? '9901')) {
                      return prev
                    }
                    return prev.concat([
                      {
                        ...props.data.dataplane.networking.inbounds[0],
                        name: key,
                        clusterName: key,
                        port: Number(port),
                        protocol: ['http', 'tcp'].find(item => typeof value[item] !== 'undefined') ?? 'tcp',
                        addressPort: `${props.data.dataplane.networking.inbounds[0].address}:${port}`,
                      },
                    ])
                  }, []) : props.data.dataplane.networking.inbounds]"
                  :key="inbounds"
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
                            :key="`${item.name}`"
                          >
                            <template
                              v-for="stats in [
                                traffic?.inbounds[item.clusterName],
                              ]"
                              :key="stats"
                            >
                              <ConnectionCard
                                data-testid="dataplane-inbound"
                                :protocol="item.protocol"
                                :port-name="item.portName"
                                :service="can('use service-insights', props.mesh) ? item.tags['kuma.io/service'] : ''"
                                :traffic="typeof error === 'undefined' ?
                                  stats :
                                  {
                                    name: '',
                                    protocol: item.protocol,
                                    port: `${item.port}`,
                                  }
                                "
                              >
                                <XAction
                                  data-action
                                  :to="{
                                    name: ((name) => name.includes('bound') ? name.replace('-outbound-', '-inbound-') : 'data-plane-connection-inbound-summary-overview-view')(String(_route.name)),
                                    params: {
                                      connection: item.name,
                                    },
                                    query: {
                                      inactive: route.params.inactive,
                                    },
                                  }"
                                >
                                  {{ item.name.replace('localhost', '').replace('_', ':') }}
                                </XAction>
                              </ConnectionCard>
                            </template>
                          </template>
                        </XLayout>
                      </template>
                    </DataCollection>
                  </ConnectionGroup>
                </template>
              </ConnectionTraffic>

              <ConnectionTraffic>
                <template
                  v-if="traffic"
                  #actions
                >
                  <XInputSwitch
                    :checked="route.params.inactive"
                    data-testid="dataplane-outbounds-inactive-toggle"
                    @change="(value) => route.update({ inactive: value })"
                  >
                    <template #label>
                      Show inactive
                    </template>
                  </XInputSwitch>

                  <XAction
                    action="refresh"
                    appearance="primary"
                    @click="refresh"
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
                  v-if="typeof error === 'undefined'"
                >
                  <XProgress
                    v-if="typeof traffic === 'undefined'"
                  />
                  <template
                    v-else
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
                    <!-- Outbounds for gateways report actual traffic on the upstream so we switch to upstream here for non-standard-->
                    <template
                      v-for="direction in ['upstream'] as const"
                      :key="direction"
                    >
                      <XNotification
                        :notify="!!Object.values(traffic.outbounds).find(item => (typeof item.tcp !== 'undefined' ? item.tcp?.[`${direction}_cx_rx_bytes_total`] : item.http?.[`${direction}_rq_total`]) ?? 0 > 0)"
                        variant="info"
                        :uri="`data-planes.notifications.recommend-reachable-services:${props.data.id}`"
                      >
                        <XI18n
                          path="data-planes.notifications.recommend-reachable"
                          :params="{ mode: props.mesh.meshServices.mode }"
                        />
                      </XNotification>
                      <DataCollection
                        type="outbounds"
                        :predicate="route.params.inactive ? undefined : ([key, item]) => ((typeof item.tcp !== 'undefined' ? item.tcp?.[`${direction}_cx_rx_bytes_total`] : item.http?.[`${direction}_rq_total`]) ?? 0) > 0"
                        :items="Object.entries<any>(traffic.outbounds)"
                        v-slot="{ items: outbounds }"
                      >
                        <ConnectionGroup
                          v-if="outbounds.length > 0"
                          type="outbound"
                          data-testid="dataplane-outbounds"
                        >
                          <!-- the outbound name is the service name potentially with a 16 digit hash appended -->
                          <!-- that potential hash follows a hypen and can contain digits and a-f -->
                          <!-- so we replace this with `` if we find it to get the service name for linking -->
                          <template
                            v-for="hash in [/-([a-f0-9]){16}$/]"
                            :key="hash"
                          >
                            <XLayout
                              type="stack"
                              size="small"
                            >
                              <template
                                v-for="[name, outbound] in outbounds"
                                :key="`${name}`"
                              >
                                <ConnectionCard
                                  data-testid="dataplane-outbound"
                                  :protocol="['grpc', 'http', 'tcp'].find(protocol => typeof outbound[protocol] !== 'undefined') ?? 'tcp'"
                                  :traffic="outbound"
                                  :service="outbound.$resourceMeta.type === '' ? name.replace(hash, '') : undefined"
                                  :direction="direction"
                                >
                                  <XAction
                                    data-action
                                    :to="{
                                      name: ((name) => name.includes('bound') ? name.replace('-inbound-', '-outbound-') : 'data-plane-connection-outbound-summary-overview-view')(String(_route.name)),
                                      params: {
                                        connection: name,
                                      },
                                      query: {
                                        inactive: route.params.inactive,
                                      },
                                    }"
                                  >
                                    {{ name }}
                                  </XAction>
                                </ConnectionCard>
                              </template>
                            </XLayout>
                          </template>
                        </ConnectionGroup>
                      </DataCollection>
                    </template>
                  </template>
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
              width="670px"
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
                :data="route.params.subscription.length > 0 ? props.data.dataplaneInsight.subscriptions : (child.route.name as string).includes('-inbound-') ? props.data.dataplane.networking.inbounds : traffic?.outbounds || {}"
                :networking="props.data.dataplane.networking"
              />
            </SummaryView>
          </RouterView>

          <div
            v-if="props.data.dataplaneInsight.subscriptions.length > 0"
            data-testid="dataplane-subscriptions"
          >
            <XCard>
              <template
                #title
              >
                <h2>{{ t('data-planes.routes.item.subscriptions.title') }}</h2>
              </template>

              <XLayout>
                <XI18n path="data-planes.routes.item.subscriptions.description" />
                <AppCollection
                  :headers="[
                    { ...me.get('headers.connection'), label: '&nbsp;', key: 'connection' },
                    { ...me.get('headers.instanceId'), label: t('http.api.property.instanceId'), key: 'instanceId' },
                    { ...me.get('headers.version'), label: t('http.api.property.version'), key: 'version' },
                    { ...me.get('headers.connected'), label: t('http.api.property.connected'), key: 'connected' },
                    { ...me.get('headers.disconnected'), label: t('http.api.property.disconnected'), key: 'disconnected' },
                    { ...me.get('headers.responses'), label: t('http.api.property.responses'), key: 'responses' },
                  ]"
                  :is-selected-row="item => item.id === route.params.subscription"
                  :items="props.data.dataplaneInsight.subscriptions.map((_, i, arr) => arr[arr.length - (i + 1)])"
                  @resize="me.set"
                >
                  <template
                    #connection="{ row: item }"
                  >
                    <template
                      v-for="connection in [item.connectTime && !item.disconnectTime ? 'healthy' : 'unhealthy'] as const"
                      :key="`${connection}`"
                    >
                      <XIcon :name="connection">
                        {{ t(`common.connection.${connection}`) }}
                      </XIcon>
                    </template>
                  </template>
                  <template
                    #instanceId="{ row: item }"
                  >
                    <XAction
                      data-action
                      :to="{
                        name: 'data-plane-subscription-summary-view',
                        params: {
                          subscription: item.id,
                        },
                      }"
                    >
                      {{ item.controlPlaneInstanceId }}
                    </XAction>
                  </template>
                  <template
                    #version="{ row: item }"
                  >
                    {{ item.version?.kumaDp?.version ?? '-' }}
                  </template>
                  <template
                    #connected="{ row: item }"
                  >
                    {{ t('common.formats.datetime', { value: Date.parse(item.connectTime ?? '') }) }}
                  </template>
                  <template
                    #disconnected="{ row: item }"
                  >
                    <template
                      v-if="item.disconnectTime"
                    >
                      {{ t('common.formats.datetime', { value: Date.parse(item.disconnectTime) }) }}
                    </template>
                  </template>
                  <template
                    #responses="{ row: item }"
                  >
                    <template
                      v-for="responses in [item.status?.total ?? {}]"
                    >
                      {{ responses.responsesSent }}/{{ responses.responsesAcknowledged }}
                    </template>
                  </template>
                </AppCollection>
              </XLayout>
            </XCard>
          </div>
        </XLayout>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import type { DataplaneOverview, DataplaneInbound } from '../data'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import TagList from '@/app/common/TagList.vue'
import ConnectionCard from '@/app/connections/components/connection-traffic/ConnectionCard.vue'
import ConnectionGroup from '@/app/connections/components/connection-traffic/ConnectionGroup.vue'
import ConnectionTraffic from '@/app/connections/components/connection-traffic/ConnectionTraffic.vue'
import { sources } from '@/app/connections/sources'
import type { Mesh } from '@/app/meshes/data'
import { useRoute } from '@/app/vue'

const _route = useRoute()

const props = defineProps<{
  data: DataplaneOverview
  mesh: Mesh
}>()
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

:deep(td:nth-child(2) a) {
  color: inherit;
  font-weight: $kui-font-weight-semibold;
  text-decoration: none;
}

@container traffic (max-width: 40.95rem) {
  .traffic .columns {
    background: none;
  }
}

.dataplane-mtls {
  border-top: $kui-border-width-10 solid $kui-color-border;
  padding-top: $kui-space-70;

  h3 {
    color: $kui-color-text;
  }
}

:deep(.about-section .about-section-content) {
  display: block !important;
}
</style>
