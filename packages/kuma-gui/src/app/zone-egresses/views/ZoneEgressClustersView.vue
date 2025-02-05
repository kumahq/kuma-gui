<template>
  <RouteView
    name="zone-egress-clusters-view"
    :params="{
      proxy: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, t, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t('zone-egresses.routes.item.navigation.zone-egress-clusters-view')"
    />
    <AppView>
      <XCard>
        <DataLoader
          :src="uri(sources, '/zone-egresses/:name/data-path/:dataPath', {
            name: route.params.proxy,
            dataPath: 'clusters',
          })"
          v-slot="{ data, refresh }"
        >
          <XCodeBlock
            language="json"
            :code="data"
            is-searchable
            :query="route.params.codeSearch"
            :is-filter-mode="route.params.codeFilter"
            :is-reg-exp-mode="route.params.codeRegExp"
            @query-change="route.update({ codeSearch: $event })"
            @filter-mode-change="route.update({ codeFilter: $event })"
            @reg-exp-mode-change="route.update({ codeRegExp: $event })"
          >
            <template #primary-actions>
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
import { sources } from '@/app/zone-egresses/sources'
</script>
