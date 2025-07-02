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
      <DataLoader :data="[props.source.data]">
        <template v-if="props.source.data">
          <DataSource
            :src="uri(sources, '/control-plane/outdated/:version', {
              version: props.source.data.zoneInsight.version?.kumaCp?.version ?? '-',
            })"
            v-slot="{ data: version }"
          >
            <template
              v-for="{ bool, key, params } in [
                {
                  bool: props.source.data.zoneInsight.store === 'memory',
                  key: 'store-memory',
                },
                {
                  bool: !props.source.data.zoneInsight.version?.kumaCp?.kumaCpGlobalCompatible,
                  key: 'global-cp-incompatible',
                  params: {
                    zoneCpVersion: props.source.data.zoneInsight.version?.kumaCp?.version ?? '-',
                    globalCpVersion: version?.version ?? '',
                  },
                },
                {
                  bool: (props.source.data.zoneInsight.connectedSubscription?.status.total.responsesRejected ?? 0) > 0,
                  key: 'global-nack-response',
                },
              ]"
              :key="key"
            >
              <XNotification
                :notify="bool"
                :data-testid="`warning-${key}`"
                :uri="`zone-cps.notifications.${key}.${props.source.data.id}`"
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
                          subscription: props.source.data.zoneInsight.connectedSubscription?.id,
                        },
                      }"
                    >
                      Zone Control Plane Summary
                    </XAction>
                  </template>
                </XI18n>
              </XNotification>
            </template>
          </DataSource>

          <XCard>
            <XCodeBlock
              v-if="Object.keys(props.source.data.zoneInsight.config).length > 0"
              language="json"
              :code="JSON.stringify(props.source.data.zoneInsight.config, null, 2)"
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
          </XCard>
        </template>
      </DataLoader>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ZoneOverview } from '../data'
import { DataSourceResponse } from '@/app/application'
import { sources } from '@/app/control-planes/sources'
const props = defineProps<{
  source: DataSourceResponse<ZoneOverview>
}>()
</script>
