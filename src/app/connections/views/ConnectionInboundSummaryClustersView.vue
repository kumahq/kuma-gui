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
    name="connection-inbound-summary-clusters-view"
  >
    <AppView>
      <template #title>
        <h3>
          <RouteTitle
            :title="`Clusters`"
          />
        </h3>
      </template>
      <div>
        <DataSource
          v-slot="{ data: clusters, error, refresh }: ClustersDataSource"
          :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/data-path/clusters`"
        >
          <ErrorBlock
            v-if="error"
            :error="error"
          />

          <LoadingBlock v-else-if="clusters === undefined" />

          <CodeBlock
            v-else
            language="json"
            :code="(() => `${
              clusters.split('\n')
                .filter(item => item.startsWith(`${props.data.service}::`))
                .map(item => item.replace(`${props.data.service}::`, ''))
                .join('\n')
            }`)()"
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

import CodeBlock from '@/app/common/code-block/CodeBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import type { DataplaneInbound } from '@/app/data-planes/data'
import type { ClustersDataSource } from '@/app/data-planes/sources'

const props = defineProps<{
  data: DataplaneInbound
}>()
</script>
