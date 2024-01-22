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
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('data-planes.routes.item.navigation.data-plane-stats-view')"
          />
        </h2>
      </template>

      <KCard>
        <DataSource
          v-slot="{ data, error, refresh }: StatsSource"
          :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/stats`"
        >
          <ErrorBlock
            v-if="error"
            :error="error"
          />

          <LoadingBlock v-else-if="data === undefined" />

          <CodeBlock
            v-else
            language="json"
            :code="data.raw"
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
        </DataSource>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { RefreshIcon } from '@kong/icons'

import { StatsSource } from '../sources'
import CodeBlock from '@/app/common/code-block/CodeBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
</script>
