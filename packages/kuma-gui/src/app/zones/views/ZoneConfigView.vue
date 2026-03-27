<template>
  <RouteView
    name="zone-cp-config-view"
    :params="{
      zone: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t('zone-cps.routes.item.navigation.zone-cp-config-view')"
    />
    <AppView
      :notifications="true"
    >
      <XCard>
        <DataLoader
          :data="[props.data]"
          v-slot="{ data: [zone] }"
        >
          <DataSource
            :src="uri(sources, '/control-plane/outdated/:version', {
              version: zone.zoneInsight.version?.kumaCp?.version ?? '-',
            })"
            v-slot="{ data: version }"
          >
            <template v-if="typeof version !== 'undefined'">
              <template
                v-for="{ bool, key, params } in [
                  {
                    bool: zone.zoneInsight.store === 'memory',
                    key: 'store-memory',
                  },
                  {
                    bool: !zone.zoneInsight.version?.kumaCp?.kumaCpGlobalCompatible,
                    key: 'global-cp-incompatible',
                    params: {
                      zoneCpVersion: zone.zoneInsight.version?.kumaCp?.version ?? '-',
                      globalCpVersion: version?.version ?? '',
                    },
                  },
                  {
                    bool: (zone.zoneInsight.connectedSubscription?.status.total.responsesRejected ?? 0) > 0,
                    key: 'global-nack-response',
                  },
                ]"
                :key="key"
              >
                <XNotification
                  :notify="bool"
                  :data-testid="`warning-${key}`"
                  :uri="`zone-cps.notifications.${key}.${zone.id}`"
                >
                  <XI18n
                    :path="`zone-cps.notifications.${key}`"
                    :params="Object.fromEntries(Object.entries(params ?? {}))"
                  >
                    <template
                      v-if="key === 'global-nack-response'"
                      #link
                    >
                      <XAction
                        data-action
                        :to="{
                          name: 'zone-cp-subscription-summary-view',
                          params: {
                            subscription: zone.zoneInsight.connectedSubscription?.id,
                          },
                        }"
                      >
                        zone control plane summary
                      </XAction>
                    </template>
                  </XI18n>
                </XNotification>
              </template>
            </template>
          </DataSource>
          <XCodeBlock
            v-if="Object.keys(zone.zoneInsight.config).length > 0"
            language="json"
            :code="JSON.stringify(zone.zoneInsight.config, null, 2)"
            is-searchable
            :query="route.params.codeSearch"
            :is-filter-mode="route.params.codeFilter"
            :is-reg-exp-mode="route.params.codeRegExp"
            @query-change="route.update({ codeSearch: $event })"
            @filter-mode-change="route.update({ codeFilter: $event })"
            @reg-exp-mode-change="route.update({ codeRegExp: $event })"
          />

          <XAlert
            v-else
            class="mt-4"
            data-testid="warning-no-subscriptions"
            variant="warning"
          >
            {{ t('zone-cps.detail.no_subscriptions') }}
          </XAlert>
        </DataLoader>
      </XCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ZoneOverview } from '../data'
import { sources } from '@/app/control-planes/sources'
const props = defineProps<{
  data: ZoneOverview | Error | undefined
}>()
</script>
