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
    name="connection-inbound-summary-stats-view"
    v-slot="{ route }"
  >
    <RouteTitle
      :render="false"
      :title="`Stats`"
    />
    <AppView>
      <DataLoader
        :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/stats/${props.dataplaneOverview.dataplane.networking.inboundAddress}`"
        v-slot="{ data: stats, refresh }: StatsSource"
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
          <CodeBlock
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
import type { DataplaneInbound, DataplaneOverview } from '@/app/data-planes/data/'

const props = defineProps<{
  data: DataplaneInbound
  dataplaneOverview: DataplaneOverview
}>()
</script>
