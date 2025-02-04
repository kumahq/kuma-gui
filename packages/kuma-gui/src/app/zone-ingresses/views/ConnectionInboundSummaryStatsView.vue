<template>
  <RouteView
    :params="{
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      zoneIngress: '',
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
        :src="uri(sources, '/connections/stats/for/:proxyType/:name/:socketAddress', {
          name: route.params.zoneIngress,
          socketAddress: props.networking.inboundAddress,
          proxyType: 'zone-ingress',
        })"
        v-slot="{ data: stats, refresh }"
      >
        <DataCollection
          :items="stats!.raw.split('\n')"
          :predicate="item => [
            `listener.${route.params.connection}`,
          ].some(prefix => item.startsWith(prefix))"
          v-slot="{ items: lines }"
        >
          <XCodeBlock
            language="json"
            :code="lines.map(item => item.replace(`${route.params.connection}.`, '').replace(`${props.data.name}.`, '')).join('\n')"
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
import { sources } from '@/app/connections/sources'
import type { DataplaneInbound, DataplaneNetworking } from '@/app/data-planes/data/'

const props = defineProps<{
  data: DataplaneInbound
  networking: DataplaneNetworking
  routeName: string
}>()
</script>
