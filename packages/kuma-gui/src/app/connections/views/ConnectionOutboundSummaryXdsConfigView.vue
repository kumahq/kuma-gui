<template>
  <RouteView
    :params="{
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      mesh: '',
      proxyType: '',
      proxy: '',
      connection: '',
      includeEds: false,
      format: String,
      expanded: false,
    }"
    :name="props.routeName"
    v-slot="{ t, route, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t('connections.routes.item.navigation.xds')"
    />
    <AppView>
      <DataLoader
        :data="[props.overview]"
        v-slot="{ data: [overviewData] }"
      >
        <DataLoader
          :src="uri(sources, '/connections/xds/for/:proxyType/:name/:mesh/outbound/:outbound/endpoints/:endpoints', {
            name: overviewData.id,
            outbound: route.params.connection,
            endpoints: String(route.params.includeEds),
            proxyType: ({ ingresses: 'zone-ingress', egresses: 'zone-egress'})[route.params.proxyType] ?? 'dataplane',
            mesh: route.params.mesh || '*',
          })"
          v-slot="{ data: [data], refresh }"
        >
          <XLayout
            variant="action-group"
          >
            <XCheckbox
              :checked="route.params.expanded"
              :label="t('connections.expanded')"
              @change="(value) => route.update({ expanded: value })"
            />
            <XCheckbox
              :checked="route.params.includeEds"
              :label="t('connections.include_endpoints')"
              @change="(value) => route.update({ includeEds: value })"
            />
            <XAction
              action="refresh"
              appearance="primary"
              @click="refresh"
            >
              {{ t('common.refresh') }}
            </XAction>
          </XLayout>

          <XCodeBlock
            language="yaml"
            is-searchable
            :code="YAML.stringify(route.params.expanded ? data.$raw : data.$filtered)"
            :query="route.params.codeSearch"
            :is-filter-mode="route.params.codeFilter"
            :is-reg-exp-mode="route.params.codeRegExp"
            @query-change="route.update({ codeSearch: $event })"
            @filter-mode-change="route.update({ codeFilter: $event })"
            @reg-exp-mode-change="route.update({ codeRegExp: $event })"
          />
        </DataLoader>
      </DataLoader>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import type { DataplaneOverview } from '@/app/data-planes/data';
import { sources } from '../sources'
import { YAML } from '@/app/application'
import type { ZoneIngressOverview } from '@/app/zone-ingresses/data';
import type { ZoneEgressOverview } from '@/app/zone-egresses/data';
const props = defineProps<{
  routeName: string
  overview: DataplaneOverview | ZoneIngressOverview | ZoneEgressOverview | Error | undefined 
}>()
</script>
