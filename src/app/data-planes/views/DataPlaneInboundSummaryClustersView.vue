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
    name="data-plane-inbound-summary-clusters-view"
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
          v-slot="{ data, error, refresh }: ClustersDataSource"
          :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/data-path/clusters`"
        >
          <ErrorBlock
            v-if="error"
            :error="error"
          />

          <LoadingBlock v-else-if="data === undefined" />

          <template
            v-else
          >
            <div>
              <div class="toolbar">
                <KButton
                  appearance="primary"
                  @click="refresh"
                >
                  <RefreshIcon :size="KUI_ICON_SIZE_30" />
                  Refresh
                </KButton>
              </div>
              <CodeBlock
                language="json"
                :code="(() => `${
                  data.split('\n')
                    .filter(item => item.startsWith(`localhost:${route.params.service}::`))
                    .map(item => item.replace(`localhost:${route.params.service}::`, ''))
                    .join('\n')
                }`)()"
                is-searchable
                :query="route.params.codeSearch"
                :is-filter-mode="route.params.codeFilter"
                :is-reg-exp-mode="route.params.codeRegExp"
                @query-change="route.update({ codeSearch: $event })"
                @filter-mode-change="route.update({ codeFilter: $event })"
                @reg-exp-mode-change="route.update({ codeRegExp: $event })"
              />
            </div>
          </template>
        </DataSource>
      </div>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { RefreshIcon } from '@kong/icons'

import type { ClustersDataSource } from '../sources'
import CodeBlock from '@/app/common/CodeBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'

</script>
<style lang="scss" scoped>
.toolbar {
  display: flex;
  justify-content: flex-end;
  gap: $kui-space-60;
  margin-bottom: $kui-space-60;
}
</style>
