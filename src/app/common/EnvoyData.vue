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
            icon="redo"
            data-testid="envoy-data-refresh-button"
            @click="refresh"
          >
            Refresh
          </KButton>
        </div>

        <CodeBlock
          id="code-block-envoy-data"
          language="json"
          :code="typeof data === 'string' ? data : JSON.stringify(data, null, 2)"
          is-searchable
          :query-key="props.queryKey"
        />
      </template>
    </DataSource>
  </div>
</template>

<script lang="ts" setup>
import { KButton } from '@kong/kongponents'

import CodeBlock from './CodeBlock.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { EnvoyDataSource } from '@/app/zones/sources'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },

  queryKey: {
    type: String,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.envoy-data-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: $kui-space-60;
}
</style>
