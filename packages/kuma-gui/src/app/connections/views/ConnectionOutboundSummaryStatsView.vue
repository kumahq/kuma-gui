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

        v-slot="{ data, refresh }"
      >
        <DataCollection
          :items="data.raw.split('\n')"
          :predicate="item => item.includes(`.${route.params.connection}.`)"
          v-slot="{ items: lines }"
        >
          <XCodeBlock
            language="json"
            :code="lines.map((item) => item.replace(`${route.params.connection}.`, '')).join('\n')"
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
import type { DataplaneNetworking } from '@/app/data-planes/data/'
const props = defineProps<{
  networking: DataplaneNetworking
  routeName: string
}>()
</script>
