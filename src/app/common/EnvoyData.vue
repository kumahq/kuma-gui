<template>
  <div>
    <DataSource
      v-slot="{ data, error, refresh }: EnvoyDataSource"
      :src="props.src"
    >
      <ErrorBlock
        v-if="error"
        :error="error"
      />

      <LoadingBlock v-else-if="data === undefined" />

      <EmptyBlock v-else-if="data === ''" />

      <template v-else>
        <div class="envoy-data-actions">
          <KButton
            appearance="primary"
            data-testid="envoy-data-refresh-button"
            @click="refresh"
          >
            <RefreshIcon :size="KUI_ICON_SIZE_30" />

            Refresh
          </KButton>
        </div>

        <CodeBlock
          id="code-block-envoy-data"
          language="json"
          :code="typeof data === 'string' ? data : JSON.stringify(data, null, 2)"
          is-searchable
          :query="props.query"
          :is-filter-mode="props.isFilterMode"
          :is-reg-exp-mode="props.isRegExpMode"
          @query-change="emit('query-change', $event)"
          @filter-mode-change="emit('filter-mode-change', $event)"
          @reg-exp-mode-change="emit('reg-exp-mode-change', $event)"
        />
      </template>
    </DataSource>
  </div>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { RefreshIcon } from '@kong/icons'

import CodeBlock from './CodeBlock.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { EnvoyDataSource } from '@/app/zones/sources'

const props = withDefaults(defineProps<{
  resource: string
  src: string
  query?: string
  isFilterMode?: boolean
  isRegExpMode?: boolean
}>(), {
  query: '',
  isFilterMode: false,
  isRegExpMode: false,
})

const emit = defineEmits<{
  (event: 'query-change', query: string): void
  (event: 'filter-mode-change', isFilterMode: boolean): void
  (event: 'reg-exp-mode-change', isRegExpMode: boolean): void
}>()
</script>

<style lang="scss" scoped>
.envoy-data-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: $kui-space-60;
}
</style>
