<template>
  <RouteView
    name="zone-egress-detail-view"
    :params="{
      subscription: '',
      zoneEgress: '',
      inactive: false,
    }"
    v-slot="{ t, route, me, uri }"
  >
    <AppView>
      <XLayout type="stack">
        <XAboutCard
          :title="t('zone-egresses.routes.item.about.title')"
          :created="props.data.creationTime"
          :modified="props.data.modificationTime"
        >
          <DefinitionCard layout="horizontal">
            <template #title>
              {{ t('http.api.property.status') }}
            </template>

            <template #body>
              <StatusBadge :status="props.data.state" />
            </template>
          </DefinitionCard>

          <DefinitionCard
            v-if="props.data.namespace.length > 0"
            layout="horizontal"
          >
            <template #title>
              {{ t('http.api.property.namespace') }}
            </template>

            <template #body>
              <XBadge appearance="decorative">
                {{ props.data.namespace }}
              </XBadge>
            </template>
          </DefinitionCard>

          <DefinitionCard layout="horizontal">
            <template #title>
              {{ t('http.api.property.address') }}
            </template>

            <template #body>
              <XCopyButton
                v-if="props.data.zoneEgress.socketAddress.length > 0"
                variant="badge"
                format="default"
                :text="props.data.zoneEgress.socketAddress"
              />

              <template v-else>
                {{ t('common.detail.none') }}
              </template>
            </template>
          </DefinitionCard>
        </XAboutCard>

        <DataLoader
          :src="uri(sources, '/connections/stats/for/zone-egress/:name/:socketAddress', {
            name: route.params.zoneEgress,
            socketAddress: props.data.zoneEgress.socketAddress,
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
                  <template
                    v-for="[name, stats] in Object.entries(traffic.inbounds)"
                    :key="`${name}`"
                  >
                    <ConnectionCard
                      protocol=""
                      :traffic="stats"
                    >
                      :{{ name.split('_').at(-1) }}
                    </ConnectionCard>
                  </template>
                </XLayout>
              </ConnectionTraffic>
              <ConnectionTraffic>
                <template
                  #actions
                >
                  <XInputSwitch
                    v-model="route.params.inactive"
                    data-testid="dataplane-outbounds-inactive-toggle"
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
                    :predicate="route.params.inactive ? undefined : ([_key, item]) => ((typeof item.tcp !== 'undefined' ? item.tcp?.[`${direction}_cx_rx_bytes_total`] : item.http?.[`${direction}_rq_total`]) as (number | undefined) ?? 0) > 0"
                    :items="Object.entries<any>(traffic.outbounds)"
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
                              {{ name }}
                            </ConnectionCard>
                          </template>
                        </XLayout>
                      </template>
                    </ConnectionGroup>
                  </DataCollection>
                </template>
              </ConnectionTraffic>
            </XLayout>
          </XCard>
        </DataLoader>
        <div
          v-if="props.data.zoneEgressInsight.subscriptions.length > 0"
        >
          <h2>{{ t('zone-egresses.routes.item.subscriptions.title') }}</h2>
          <AppCollection
            :headers="[
              { ...me.get('headers.instanceId'), label: t('http.api.property.instanceId'), key: 'instanceId' },
              { ...me.get('headers.version'), label: t('http.api.property.version'), key: 'version' },
              { ...me.get('headers.connected'), label: t('http.api.property.connected'), key: 'connected' },
              { ...me.get('headers.disconnected'), label: t('http.api.property.disconnected'), key: 'disconnected' },
              { ...me.get('headers.responses'), label: t('http.api.property.responses'), key: 'responses' },
            ]"
            :is-selected-row="item => item.id === route.params.subscription"
            :items="props.data.zoneEgressInsight.subscriptions.map((_, i, arr) => arr[arr.length - (i + 1)])"
            @resize="me.set"
          >
            <template
              #instanceId="{ row: item }"
            >
              <XAction
                data-action
                :to="{
                  name: 'zone-egress-subscription-summary-view',
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
          <RouterView
            v-slot="{ Component }"
          >
            <SummaryView
              v-if="route.child()"
              width="670px"
              @close="function () {
                route.replace({
                  name: 'zone-egress-detail-view',
                  params: {
                    zoneEgress: route.params.zoneEgress,
                  },
                })
              }"
            >
              <component
                :is="Component"
                :data="props.data.zoneEgressInsight.subscriptions"
              />
            </SummaryView>
          </RouterView>
        </div>
      </XLayout>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ZoneEgressOverview } from '../data'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import DefinitionCard from '@/app/common/DefinitionCard.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import ConnectionCard from '@/app/connections/components/connection-traffic/ConnectionCard.vue'
import ConnectionGroup from '@/app/connections/components/connection-traffic/ConnectionGroup.vue'
import ConnectionTraffic from '@/app/connections/components/connection-traffic/ConnectionTraffic.vue'
import { sources } from '@/app/connections/sources'
const props = defineProps<{
  data: ZoneEgressOverview
}>()
</script>
