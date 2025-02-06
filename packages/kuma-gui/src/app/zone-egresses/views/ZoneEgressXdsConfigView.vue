<template>
  <RouteView
    name="zone-egress-xds-config-view"
    :params="{
      proxy: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      includeEds: false,
    }"
    v-slot="{ route, t, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t('zone-egresses.routes.item.navigation.zone-egress-xds-config-view')"
    />
    <AppView>
      <XCard>
        <DataLoader
          :src="uri(sources, '/zone-egresses/:name/xds/:endpoints', {
            name: route.params.proxy,
            endpoints: String(route.params.includeEds),
          })"
          v-slot="{ data, refresh }"
        >
          <XCodeBlock
            language="json"
            :code="JSON.stringify(data, null, 2)"
            is-searchable
            :query="route.params.codeSearch"
            :is-filter-mode="route.params.codeFilter"
            :is-reg-exp-mode="route.params.codeRegExp"
            @query-change="route.update({ codeSearch: $event })"
            @filter-mode-change="route.update({ codeFilter: $event })"
            @reg-exp-mode-change="route.update({ codeRegExp: $event })"
          >
            <template #primary-actions>
              <XCheckbox
                :checked="route.params.includeEds"
                label="Include Endpoints"
                @change="(value) => route.update({ includeEds: value})"
              />
              <XAction
                action="refresh"
                appearance="primary"
                @click="refresh"
              >
                Refresh
              </XAction>
            </template>
          </XCodeBlock>
        </DataLoader>
      </XCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
</script>
