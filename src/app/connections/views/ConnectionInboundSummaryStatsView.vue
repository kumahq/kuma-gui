<template>
  <RouteView
    v-slot="{ route }"
    :params="{
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      mesh: '',
      dataPlane: '',
      service: '',
    }"
    name="connection-inbound-summary-stats-view"
  >
    <AppView>
      <template #title>
        <h3>
          <RouteTitle
            :title="`Stats`"
          />
        </h3>
      </template>
      <div>
        <DataLoader
          v-slot="{ data: stats, refresh }: StatsSource"
          :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/stats/${props.dataplaneOverview.dataplane.networking.address}`"
        >
          <DataCollection
            v-slot="{ items: lines }"
            :items="stats!.raw.split('\n')"
            :predicate="item => [
              `listener.${props.data.name}.`,
              `cluster.${props.data.cluster}.`,
              `http.${props.data.cluster}.`,
              `tcp.${props.data.cluster}.`,
            ].some(prefix => item.startsWith(prefix)) && (!item.includes('.rds.') || item.includes(`_${props.data.port}`))"
          >
            <CodeBlock
              language="json"
              :code="lines.map(item => item.replace(`${props.data.name}.`, '').replace(`${props.data.cluster}.`, '')).join('\n')"
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
      </div>
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
