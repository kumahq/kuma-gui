<template>
  <RouteView
    name="zone-cp-list-view"
    :params="{
      page: 1,
      size: Number,
      zone: '',
      s: '',
    }"
    v-slot="{ route, t, can, uri, me }"
  >
    <DataSource
      :src="uri(zoneSources, '/zone-cps', {}, {
        page: route.params.page,
        size: route.params.size,
        search: route.params.s,
      })"
      v-slot="{ data, error, refresh }"
    >
      <AppView
        :docs="data && data?.items?.length ? t('zones.href.docs.cta'): ''"
      >
        <template #title>
          <h1>
            <RouteTitle
              :title="t('zone-cps.routes.items.title')"
            />
          </h1>
        </template>

        <DataSource
          :src="`/zone-ingress-overviews?page=1&size=100`"
          @change="getIngresses"
        />
        <DataSource
          :src="`/zone-egress-overviews?page=1&size=100`"
          @change="getEgresses"
        />
        <XI18n
          v-if="!can('view growth-new-empty-states') || data?.items.length"
          path="zone-cps.routes.items.intro"
          default-path="common.i18n.ignore-error"
        />
        <XTeleportTemplate
          v-if="(data?.items ?? []).length > 0"
          :to="{ name: 'zone-cp-list-view-actions'}"
        >
          <ZoneActionGroup />
        </XTeleportTemplate>
        <XCard>
          <XLayout>
            <search>
              <form @submit.prevent>
                <XSearch
                  class="search-field"
                  :keys="['name']"
                  :value="route.params.s"
                  @change="(s) => route.update({ page: 1, s })"
                />
              </form>
            </search>
            <DataLoader
              :data="[data]"
              :errors="[error]"
              variant="list"
            >
              <DataCollection
                type="zone-cps"
                :items="data?.items ?? [undefined]"
                :page="route.params.page"
                :page-size="route.params.size"
                :total="data?.total"
                @change="route.update"
              >
                <AppCollection
                  class="zone-cp-collection"
                  data-testid="zone-cp-collection"
                  :headers="[
                    { ...me.get('headers.type'), label: '&nbsp;', key: 'type' },
                    { ...me.get('headers.name'), label: 'Name', key: 'name' },
                    { ...me.get('headers.zoneCpVersion'), label: 'Zone leader CP version', key: 'zoneCpVersion' },
                    { ...me.get('headers.ingress'), label: 'Ingresses (online / total)', key: 'ingress' },
                    { ...me.get('headers.egress'), label: 'Egresses (online / total)', key: 'egress' },
                    { ...me.get('headers.state'), label: 'Status', key: 'state' },
                    { ...me.get('headers.warnings'), label: 'Warnings', key: 'warnings', hideLabel: true },
                    { ...me.get('headers.actions'), label: 'Actions', key: 'actions', hideLabel: true },
                  ]"
                  :items="data?.items"
                  :is-selected-row="(row) => row.name === route.params.zone"
                  @resize="me.set"
                >
                  <template
                    #type="{ row: item }"
                  >
                    <template
                      v-for="env in [(['kubernetes', 'universal'] as const).find(env => env === item.zoneInsight.environment) ?? 'kubernetes']"
                      :key="env"
                    >
                      <XIcon
                        :name="env"
                      >
                        {{ t(`common.product.environment.${env}`) }}
                      </XIcon>
                    </template>
                  </template>
                  <template #name="{ row: item }">
                    <XAction
                      data-action
                      :to="{
                        name: 'zone-cp-detail-view',
                        params: {
                          zone: item.name,
                        },
                        query: {
                          page: route.params.page,
                          size: route.params.size,
                          s: route.params.s,
                        },
                      }"
                    >
                      {{ item.name }}
                    </XAction>
                  </template>

                  <template #zoneCpVersion="{ row: item }">
                    {{ get(item.zoneInsight, 'version.kumaCp.version', t('common.collection.none')) }}
                  </template>

                  <template #ingress="{ row: item }">
                    <template
                      v-for="proxies in [ingresses[item.name] || {online: [], offline: []}]"
                    >
                      {{ proxies.online.length }} / {{ proxies.online.length + proxies.offline.length }}
                    </template>
                  </template>

                  <template #egress="{ row: item }">
                    <template
                      v-for="proxies in [egresses[item.name] || {online: [], offline: []}]"
                    >
                      {{ proxies.online.length }} / {{ proxies.online.length + proxies.offline.length }}
                    </template>
                  </template>

                  <template #state="{ row: item }">
                    <StatusBadge
                      :status="item.state"
                    />
                  </template>

                  <template
                    #warnings="{ row: item }"
                  >
                    <template
                      v-for="warnings in [[
                        {
                          bool: item.zoneInsight.store === 'memory',
                          key: 'store-memory',
                        },
                        {
                          bool: !item.zoneInsight.version?.kumaCp?.kumaCpGlobalCompatible,
                          key: 'global-cp-incompatible',
                        },
                      ].filter(({ bool }) => bool)]"
                      :key="typeof warnings"
                    >
                      <XIcon
                        v-if="warnings.length > 0"
                        name="warning"
                        data-testid="warning"
                      >
                        <ul>
                          <li
                            v-for="{ key } in warnings"
                            :key="key"
                            :data-testid="`warning-${key}`"
                          >
                            {{ t(`zone-cps.list.warnings.${key}`) }}
                          </li>
                        </ul>
                      </XIcon>
                      <template v-else>
                        {{ t('common.collection.none') }}
                      </template>
                    </template>
                  </template>

                  <template
                    #actions="{ row }"
                  >
                    <ZoneActionGroup
                      :item="row"
                      @change="refresh"
                    >
                      <XAction
                        :to="{
                          name: 'zone-cp-detail-view',
                          params: {
                            zone: row.name,
                          },
                        }"
                      >
                        {{ t('common.collection.actions.view') }}
                      </XAction>
                    </ZoneActionGroup>
                  </template>
                </AppCollection>
              </DataCollection>
            </DataLoader>
          </XLayout>
        </XCard>
        <RouterView
          v-if="route.params.zone"
          v-slot="child"
        >
          <SummaryView
            @close="route.replace({
              name: 'zone-cp-list-view',
              query: {
                page: route.params.page,
                size: route.params.size,
                s: route.params.s,
              },
            })"
          >
            <component
              :is="child.Component"
              :name="route.params.zone"
              :zone-overview="data?.items.find((item) => item.name === route.params.zone)"
            />
          </SummaryView>
        </RouterView>
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { useZoneActionGroup } from '../'
import { sources as zoneSources } from '../sources'
import { get } from '@/app/application'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import StatusBadge from '@/app/common/StatusBadge.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import type { ZoneEgressOverview } from '@/app/zone-egresses/data'
import type { ZoneIngressOverview } from '@/app/zone-ingresses/data'

type ZoneProxies<T> = Record<string, {online: T[], offline: T[]}>
const ingresses = ref<ZoneProxies<ZoneIngressOverview>>({})
const egresses = ref<ZoneProxies<ZoneEgressOverview>>({})
const ZoneActionGroup = useZoneActionGroup()

const getIngresses = (data: {items: ZoneIngressOverview[]}) => {
  const prop = 'zoneIngress'
  ingresses.value = data.items.reduce((prev, item) => {
    const name = item[prop]?.zone
    if (typeof name !== 'undefined') {
      if (typeof prev[name] === 'undefined') {
        prev[name] = {
          online: [],
          offline: [],
        }
      }
      const state = typeof item[`${prop}Insight`].connectedSubscription !== 'undefined' ? 'online' : 'offline'
      prev[name][state].push(item)
    }
    return prev
  }, {} as ZoneProxies<ZoneIngressOverview>)
}
const getEgresses = (data: {items: ZoneEgressOverview[]}) => {
  const prop = 'zoneEgress'
  egresses.value = data.items.reduce((prev, item) => {
    const name = item[prop]?.zone
    if (typeof name !== 'undefined') {
      if (typeof prev[name] === 'undefined') {
        prev[name] = {
          online: [],
          offline: [],
        }
      }
      const state = typeof item[`${prop}Insight`].connectedSubscription !== 'undefined' ? 'online' : 'offline'
      prev[name][state].push(item)
    }
    return prev
  }, {} as ZoneProxies<ZoneEgressOverview>)
}
</script>

<style lang="scss" scoped>
.app-collection:deep(:is(th, td):nth-child(1)) {
  padding-left: 8px !important;
  padding-right: 0 !important;
  width: 16px !important;
}
.app-collection :deep(td:nth-child(2) a) {
  color: inherit;
  font-weight: $kui-font-weight-semibold;
  text-decoration: none;
}
.search-field {
  width: 100%;
}
</style>
