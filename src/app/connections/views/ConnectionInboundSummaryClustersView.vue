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
    name="connection-inbound-summary-clusters-view"
    v-slot="{ route }"
  >
    <RouteTitle
      :render="false"
      :title="`Clusters`"
    />
    <AppView>
      <DataLoader
        :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/data-path/clusters`"
        v-slot="{ data: clusters, refresh }: ClustersDataSource"
      >
        <DataCollection
          :items="clusters!.split('\n')"
          :predicate="item => item.startsWith(`${props.data.service}::`)"
          v-slot="{ items: lines }"
        >
          <CodeBlock
            language="json"
            :code="lines.map(item => item.replace(`${props.data.service}::`, '')).join('\n')"
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

import CodeBlock from '@/app/common/code-block/CodeBlock.vue'
import type { DataplaneInbound } from '@/app/data-planes/data'
import type { ClustersDataSource } from '@/app/data-planes/sources'

const props = defineProps<{
  data: DataplaneInbound
}>()
</script>
