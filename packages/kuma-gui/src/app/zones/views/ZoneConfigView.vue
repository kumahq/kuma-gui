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
      <AppView>
        <template
          v-if="props.data.warnings.length > 0"
          #notifications
        >
          <ul>
            <li
              v-for="warning in props.data.warnings"
              :key="warning.kind"
              :data-testid="`warning-${warning.kind}`"
            >
              <XI18n
                :path="`common.warnings.${warning.kind}`"
                :params="{
                  zoneCpVersion: warning.payload.zoneCpVersion ?? '',
                  ...(warning.kind === 'INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS' ? {
                    globalCpVersion: version?.version ?? '',
                  } : {}),
                }"
              />
            </li>
          </ul>
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
