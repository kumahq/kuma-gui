<template>
  <div>
    <KAlert
      v-if="props.status !== 'online'"
      appearance="info"
    >
      <template #alertMessage>
        <p>{{ t('common.detail.no_envoy_data', { resource: props.resource }) }}</p>
      </template>
    </KAlert>

    <DataSource
      v-else
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
          @query-change="emit('query-change', $event)"
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
import { StatusKeyword } from '@/types'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = withDefaults(defineProps<{
  status: StatusKeyword
  resource: string
  src: string
  query?: string
}>(), {
  query: '',
})

const emit = defineEmits<{
  (event: 'query-change', query: string): void
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
