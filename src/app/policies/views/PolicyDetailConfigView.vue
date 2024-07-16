<template>
  <RouteView
    name="policy-detail-config-view"
    :params="{
      mesh: '',
      policy: '',
      policyPath: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
    v-slot="{ route, uri }"
  >
    <AppView>
      <KCard>
        <ResourceCodeBlock
          :resource="props.data.config"
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
            :src="uri(sources, '/meshes/:mesh/policy-path/:path/policy/:name/as/kubernetes', {
              mesh: route.params.mesh,
              path: route.params.policyPath,
              name: route.params.policy,
            }, {
              cacheControl: 'no-cache',
            })"
            @change="(data) => {
              copy((resolve) => resolve(data))
            }"
            @error="(e) => {
              copy((_resolve, reject) => reject(e))
            }"
          />
        </ResourceCodeBlock>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import type { Policy } from '../data'
import { sources } from '../sources'
import ResourceCodeBlock from '@/app/common/code-block/ResourceCodeBlock.vue'
const props = defineProps<{
  data: Policy
}>()
</script>
