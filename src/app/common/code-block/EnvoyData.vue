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

      <CodeBlock
        v-else
        language="json"
        :code="typeof data === 'string' ? data : JSON.stringify(data, null, 2)"
        is-searchable
        :query="props.query"
        :is-filter-mode="props.isFilterMode"
        :is-reg-exp-mode="props.isRegExpMode"
        @query-change="emit('query-change', $event)"
        @filter-mode-change="emit('filter-mode-change', $event)"
        @reg-exp-mode-change="emit('reg-exp-mode-change', $event)"
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
</template>

<script lang="ts" setup>
import { RefreshIcon } from '@kong/icons'

import CodeBlock from './CodeBlock.vue'
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
