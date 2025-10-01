<template>
  <RouteView
    name="zone-egress-detail-view"
    :params="{
      inactive: Boolean,
      subscription: '',
      proxy: '',
    }"
    v-slot="{ t, route, uri }"
  >
    <AppView>
      <XLayout type="stack">
        <XAboutCard
          :title="t('zone-egresses.routes.item.about.title')"
          :created="props.data.creationTime"
          :modified="props.data.modificationTime"
          class="about-section"
        >
          <XLayout>
            <XDl variant="x-stack">
              <div>
                <dt>
                  {{ t('http.api.property.status') }}
                </dt>
                <dd>
                  <StatusBadge :status="props.data.state" />
                </dd>
              </div>
              <div v-if="props.data.namespace.length > 0">
                <dt>
                  {{ t('http.api.property.namespace') }}
                </dt>
                <dd>
                  <XBadge appearance="decorative">
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
                    v-if="props.data.zoneEgress.socketAddress.length > 0"
                    variant="badge"
                    format="default"
                    :text="props.data.zoneEgress.socketAddress"
                  />

                  <template v-else>
                    {{ t('common.detail.none') }}
                  </template>
                </dd>
              </div>
            </XDl>

            <XLayout
              v-if="props.data.zoneEgressInsight.subscriptions.length > 0"
              data-testid="about-zone-egress-subscriptions"
              class="about-subsection"
            >
              <XLayout type="separated">
                <h3>{{ t('zone-egresses.routes.item.subscriptions.title') }}</h3>
                <XAction
                  data-action
                  appearance="anchor"
                  :to="{
                    name: 'zone-egress-subscriptions-list-view',
                    params: {
                      proxy: route.params.proxy,
                    },
                    query: {
                      inactive: route.params.inactive,
                    },
                  }"
                >
                  ({{ t('zone-egresses.routes.item.subscriptions.show-details') }})
                </XAction>
              </XLayout>
              <template
                v-for="subscription in [props.data.zoneEgressInsight.connectedSubscription]"
                :key="typeof subscription"
              >
                <template v-if="!subscription?.disconnectTime && subscription?.connectTime">
                  <XDl variant="x-stack">
                    <div>
                      <dt>
                        <XI18n
                          path="zone-egresses.routes.item.subscriptions.connected"
                        />
                      </dt>
                      <dd>
                        <XBadge appearance="neutral">
                          {{ t('common.formats.datetime', { value: Date.parse(subscription.connectTime) }) }}
                        </XBadge>
                      </dd>
                    </div>
                    <div>
                      <dt>
                        <XI18n
                          path="zone-egresses.routes.item.subscriptions.instance"
                        />
                      </dt>
                      <dd>
                        <XBadge appearance="info">
                          {{ subscription.controlPlaneInstanceId }}
                        </XBadge>
                      </dd>
                    </div>
                    <div>
                      <dt>
                        <XI18n
                          path="zone-egresses.routes.item.subscriptions.version"
                        />
                      </dt>
                      <dd>
                        <XBadge appearance="info">
                          {{ subscription.version?.kumaDp?.version ?? t('common.unknown') }}
                        </XBadge>
                      </dd>
                    </div>
                  </XDl>
                </template>
                <template v-else>
                  <XI18n path="zone-egresses.routes.item.subscriptions.disconnected" />
                </template>
              </template>
            </XLayout>
          </XLayout>
        </XAboutCard>

        <DataLoader
          :src="uri(sources, '/connections/stats/for/:proxyType/:name/:mesh/:socketAddress', {
            name: route.params.proxy,
            mesh: '*',
            socketAddress: props.data.zoneEgress.socketAddress,
            proxyType: 'zone-egress',
          })"
          v-slot="{ data: traffic, refresh }"
        >
          <XCard>
            <XLayout
              type="columns"
            >
              <ConnectionTraffic>
                <XLayout
                  type="stack"
                  size="small"
                >
                  <DataCollection
                    type="inbounds"
                    :items="Object.entries(traffic.inbounds)"
                    v-slot="{ items }"
                  >
                    <template
                      v-for="[name, stats] in items"
                      :key="`${name}`"
                    >
                      <ConnectionCard
                        protocol=""
                        :traffic="stats"
                      >
                        <XAction
                          data-action
                          :to="{
                            name: ((name) => name.includes('bound') ? name.replace('-outbound-', '-inbound-') : 'zone-egress-connection-inbound-summary-stats-view')(String(_route.name)),
                            params: {
                              connection: name,
                            },
                            query: {
                              inactive: route.params.inactive,
                            },
                          }"
                        >
                          :{{ name.split('_').at(-1) }}
                        </XAction>
                      </ConnectionCard>
                    </template>
                  </DataCollection>
                </XLayout>
              </ConnectionTraffic>
              <ConnectionTraffic>
                <template
                  #actions
                >
                  <XInputSwitch
                    :checked="route.params.inactive"
                    data-testid="dataplane-outbounds-inactive-toggle"
                    @change="(value) => route.update({ inactive: value})"
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

                <!-- Outbounds for gateways report actual traffic on the upstream so we switch to upstream here for non-standard-->
                <template
                  v-for="direction in ['upstream'] as const"
                  :key="direction"
                >
                  <DataCollection
                    type="outbounds"
                    :items="Object.entries<any>(traffic.outbounds)"
                    v-slot="{ items: outboundEntries }"
                  >
                    <DataCollection
                      type="activeOutbounds"
                      :predicate="route.params.inactive ? undefined : ([_key, item]) => ((typeof item.tcp !== 'undefined' ? item.tcp?.[`${direction}_cx_rx_bytes_total`] : item.http?.[`${direction}_rq_total`]) as (number | undefined) ?? 0) > 0"
                      :items="outboundEntries"
                      v-slot="{ items: outbounds }"
                    >
                      <ConnectionGroup
                        v-if="outbounds.length > 0"
                        type="outbound"
                      >
                        <!-- the outbound name is the service name potentially with a 16 digit hash appended -->
                        <!-- that potential hash follows a hypen and can contain digits and a-f -->
                        <!-- so we replace this with `` if we find it to get the service name for linking -->
                        <template
                          v-for="_hash in [/-([a-f0-9]){16}$/]"
                          :key="_hash"
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
                                protocol=""
                                :traffic="outbound"
                                :direction="direction"
                              >
                                <XAction
                                  data-action
                                  :to="{
                                    name: ((name) => name.includes('bound') ? name.replace('-inbound-', '-outbound-') : 'zone-egress-connection-outbound-summary-stats-view')(String(_route.name)),
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
                  </DataCollection>
                </template>
              </ConnectionTraffic>
            </XLayout>
          </XCard>
          <RouterView
            v-slot="child"
          >
            <XDrawer
              v-if="child.route.name !== route.name"
              width="670px"
              @close="function () {
                route.replace({
                  name: 'zone-egress-detail-view',
                  params: {
                    proxyType: 'egresses',
                    proxy: route.params.proxy,
                  },
                })
              }"
            >
              <component
                :is="child.Component"
                :data="route.params.subscription.length > 0 ? props.data.zoneEgressInsight.subscriptions : (child.route.name as string).includes('-inbound-') ? [props.data.zoneEgress] : traffic?.outbounds || {}"
                :networking="props.data.zoneEgress.networking"
              />
            </XDrawer>
          </RouterView>
        </DataLoader>
      </XLayout>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ZoneEgressOverview } from '../data'
import StatusBadge from '@/app/common/StatusBadge.vue'
import ConnectionCard from '@/app/connections/components/connection-traffic/ConnectionCard.vue'
import ConnectionGroup from '@/app/connections/components/connection-traffic/ConnectionGroup.vue'
import ConnectionTraffic from '@/app/connections/components/connection-traffic/ConnectionTraffic.vue'
import { sources } from '@/app/connections/sources'
import { useRoute } from '@/app/vue'

const props = defineProps<{
  data: ZoneEgressOverview
}>()
const _route = useRoute()
</script>
<style lang="scss" scoped>
.service-traffic-card {
  cursor: pointer;
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
