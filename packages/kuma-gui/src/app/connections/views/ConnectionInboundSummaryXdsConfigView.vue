<template>
  <RouteView
    :params="{
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      mesh: '',
      proxy: '',
      connection: '',
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
        :src="uri(sources, '/meshes/:mesh/dataplanes/:dataplane/inbound/:inbound/xds', {
          mesh: route.params.mesh,
          dataplane: route.params.proxy,
          inbound: `${props.data.port}`,
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
              {{ t('common.refresh') }}
            </XAction>
          </template>
        </XCodeBlock>
      </DataLoader>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { sources } from '../sources'
import type { DataplaneInbound } from '@/app/data-planes/data/'

const props = defineProps<{
  data: DataplaneInbound
  routeName: string
}>()
</script>
