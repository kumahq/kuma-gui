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
        :src="uri(sources, '/connections/xds/for/:proxyType/:name/:mesh/outbound/:outbound/endpoints/:endpoints', {
          name: route.params.proxy,
          outbound: route.params.connection,
          endpoints: String(route.params.includeEds),
          proxyType: ({ ingresses: 'zone-ingress', egresses: 'zone-egress'})[route.params.proxyType] ?? 'dataplane',
          mesh: route.params.mesh || '*',
        })"
        v-slot="{ data, refresh }"
      >
        <XLayout
          variant="action-group"
          justify="end"
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
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { sources } from '../sources'
import { YAML } from '@/app/application'
const props = defineProps<{
  routeName: string
}>()
</script>
