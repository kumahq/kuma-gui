<template>
  <RouteView
    v-slot="{ route, t }"
    name="data-plane-stats-view"
    :params="{
      mesh: '',
      dataPlane: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
    }"
  >
    <RouteTitle
      :render="false"
      :title="t('data-planes.routes.item.navigation.data-plane-stats-view')"
    />
    <AppView>
      <KCard>
        <DataLoader
          v-slot="{ data: statsData, refresh }: StatsSource"
          :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/stats/${props.data.dataplane.networking.inboundAddress}`"
        >
          <CodeBlock
            language="json"
            :code="statsData!.raw"
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
                <RefreshIcon :size="KUI_ICON_SIZE_30" />
                Refresh
              </KButton>
            </template>
          </CodeBlock>
        </DataLoader>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { RefreshIcon } from '@kong/icons'

import type { DataplaneOverview } from '../sources'
import CodeBlock from '@/app/common/code-block/CodeBlock.vue'
import type { StatsSource } from '@/app/connections/sources'

const props = defineProps<{
  data: DataplaneOverview
}>()
</script>
