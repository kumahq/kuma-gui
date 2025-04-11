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
    <DataSource
      :src="uri(sources, '/control-plane/outdated/:version', {
        version: props.data.zoneInsight.version?.kumaCp?.version ?? '-',
      })"
      v-slot="{ data: version }"
    >
      <AppView
        :notifications="true"
      >
        <template
          v-for="{ bool, key, params } in [
            {
              bool: props.data.zoneInsight.store === 'memory',
              key: 'store-memory',
            },
            {
              bool: !props.data.zoneInsight.version?.kumaCp?.kumaCpGlobalCompatible,
              key: 'global-cp-incompatible',
              params: {
                zoneCpVersion: props.data.zoneInsight.version?.kumaCp?.version ?? '-',
                globalCpVersion: version?.version ?? '',
              },
            },
            {
              bool: (props.data.zoneInsight.connectedSubscription?.status.total.responsesRejected ?? 0) > 0,
              key: 'global-nack-response',
            },
          ]"
          :key="key"
        >
          <XNotification
            v-if="bool"
            :data-testid="`warning-${key}`"
            :uri="`zone-cps.notifications.${key}.${props.data.id}`"
          >
            <XI18n
              :path="`zone-cps.notifications.${key}`"
              :params="Object.fromEntries(Object.entries(params ?? {}))"
            />
          </XNotification>
        </template>

        <XCard>
          <XCodeBlock
            v-if="Object.keys(props.data.zoneInsight.config).length > 0"
            language="json"
            :code="JSON.stringify(props.data.zoneInsight.config, null, 2)"
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
      </AppView>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import type { ZoneOverview } from '../data'
import { sources } from '@/app/control-planes/sources'
const props = defineProps<{
  data: ZoneOverview
}>()
</script>
