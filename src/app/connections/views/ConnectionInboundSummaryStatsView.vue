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
        <DataSource
          v-slot="{ data: stats, error, refresh }: StatsSource"
          :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/stats/${route.params.service}`"
        >
          <ErrorBlock
            v-if="error"
            :error="error"
          />

          <LoadingBlock v-else-if="stats === undefined" />
          <CodeBlock
            v-else
            language="json"
            :code="findService(stats)"
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
        </DataSource>
      </div>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { RefreshIcon } from '@kong/icons'

import { StatsSource } from '../sources'
import CodeBlock from '@/app/common/code-block/CodeBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import type { DataplaneInbound } from '@/app/data-planes/data'

const props = defineProps<{
  data: DataplaneInbound
}>()
const findService = (data: { raw: string }) => {
  return data.raw.split('\n')
    .filter(item => [
      `listener.${props.data.name}.`,
      `cluster.${props.data.cluster}.`,
      `http.${props.data.cluster}.`,
      `tcp.${props.data.cluster}.`,
    ].some(prefix => item.startsWith(prefix)))
    .filter(item => !item.includes('.rds.') || item.includes(`_${props.data.port}`)) // find the weirder rds lines that don't correspond
    .map((item) => item.replace(`${props.data.name}.`, '').replace(`${props.data.cluster}.`, ''))
    .join('\n')
}
</script>
