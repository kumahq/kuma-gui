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
    v-slot="{ route, uri }"
  >
    <RouteTitle
      :render="false"
      :title="`Stats`"
    />
    <AppView>
      <DataLoader
        :src="uri(sources, '/meshes/:mesh/dataplanes/:name/stats/:address', {
          mesh: route.params.mesh,
          name: route.params.proxy,
          address: props.networking.inboundAddress,
        })"
        v-slot="{ data: stats, refresh }"
      >
        <DataCollection
          :items="stats!.raw.split('\n')"
          :predicate="item => [
            `listener.${props.data.listenerAddress.length > 0 ? props.data.listenerAddress : route.params.connection}`,
            `cluster.${props.data.name}.`,
            `http.${props.data.name}.`,
            `tcp.${props.data.name}.`,
          ].some(prefix => item.startsWith(prefix)) && (!item.includes('.rds.') || item.includes(`_${props.data.port}`))"
          v-slot="{ items: lines }"
        >
          <XCodeBlock
            language="json"
            :code="lines.map(item => item.replace(`${props.data.listenerAddress.length > 0 ? props.data.listenerAddress : route.params.connection}.`, '').replace(`${props.data.name}.`, '')).join('\n')"
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
        </DataCollection>
      </DataLoader>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { sources } from '../sources'
import type { DataplaneInbound, DataplaneNetworking } from '@/app/data-planes/data/'

const props = defineProps<{
  data: DataplaneInbound
  networking: DataplaneNetworking
  routeName: string
}>()
</script>
