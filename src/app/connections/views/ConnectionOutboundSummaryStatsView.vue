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
    name="connection-outbound-summary-stats-view"
    v-slot="{ route }"
  >
    <RouteTitle
      :render="false"
      :title="`Stats`"
    />
    <AppView>
      <DataLoader
        :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/stats/${props.dataplaneOverview.dataplane.networking.inboundAddress}`"
        v-slot="{ data, refresh }: StatsSource"
      >
        <DataCollection
          :items="data!.raw.split('\n')"
          :predicate="item => item.includes(`.${route.params.connection}.`)"
          v-slot="{ items: lines }"
        >
          <CodeBlock
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
              <KButton
                appearance="primary"
                @click="refresh"
              >
                <RefreshIcon />

                Refresh
              </KButton>
            </template>
          </CodeBlock>
        </DataCollection>
      </DataLoader>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { RefreshIcon } from '@kong/icons'

import { StatsSource } from '../sources'
import CodeBlock from '@/app/common/code-block/CodeBlock.vue'
import type { DataplaneOverview } from '@/app/data-planes/data/'
const props = defineProps<{
  dataplaneOverview: DataplaneOverview
}>()
</script>
