<template>
  <RouteView
    :name="props.routeName"
    :params="{
      mesh: '',
      dataPlane: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, uri }"
  >
    <AppView>
      <ResourceCodeBlock
        :resource="props.data.config"
        language="yaml"
        is-searchable
        :query="route.params.codeSearch"
        :is-filter-mode="route.params.codeFilter"
        :is-reg-exp-mode="route.params.codeRegExp"
        @query-change="route.update({ codeSearch: $event })"
        @filter-mode-change="route.update({ codeFilter: $event })"
        @reg-exp-mode-change="route.update({ codeRegExp: $event })"
        v-slot="{ copy, copying }"
      >
        <DataSource
          v-if="copying"
          :src="uri(sources, `/meshes/:mesh/dataplanes/:name/as/kubernetes`, {
            mesh: route.params.mesh,
            name: route.params.dataPlane,
          }, {
            cacheControl: 'no-store',
          })"
          @change="(data) => {
            copy((resolve) => resolve(data))
          }"
          @error="(e) => {
            copy((_resolve, reject) => reject(e))
          }"
        />
      </ResourceCodeBlock>
    </AppView>
  </RouteView>
</template>

<script setup lang="ts">
import type { DataplaneOverview } from '../data'
import { sources } from '../sources'
import ResourceCodeBlock from '@/app/x/components/x-code-block/ResourceCodeBlock.vue'

const props = defineProps<{
  data: DataplaneOverview
  routeName: string
}>()
</script>
