<template>
  <RouteView
    :params="{
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      mesh: '',
      dataPlane: '',
      connection: '',
    }"
    name="connection-inbound-summary-xds-config-view"
    v-slot="{ route, uri }"
  >
    <RouteTitle
      :render="false"
      :title="`XDS Configuration`"
    />
    <AppView>
      <DataLoader
        :src="uri(sources, '/meshes/:mesh/dataplanes/:dataplane/inbound/:inbound/xds', {
          mesh: route.params.mesh,
          dataplane: route.params.dataPlane,
          inbound: `${props.data.addressPort}`,
        })"
        v-slot="{ data: raw, refresh }"
      >
        <XCodeBlock
          language="json"
          :code="JSON.stringify(raw, null, 2)"
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
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import type { DataplaneInbound, DataplaneOverview } from '@/app/data-planes/data/'
import { sources } from '@/app/data-planes/sources'

const props = defineProps<{
  data: DataplaneInbound
  dataplaneOverview: DataplaneOverview
}>()
</script>
