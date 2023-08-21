<template>
  <div>
    <div class="envoy-data-actions">
      <KButton
        appearance="primary"
        icon="redo"
        data-testid="envoy-data-refresh-button"
        @click="emit('refresh')"
      >
        Refresh
      </KButton>
    </div>

    <CodeBlock
      id="code-block-envoy-data"
      language="json"
      :code="typeof props.content === 'string' ? props.content : JSON.stringify(props.content, null, 2)"
      is-searchable
      :query-key="props.queryKey"
    />
  </div>
</template>

<script lang="ts" setup>
import { KButton } from '@kong/kongponents'
import { PropType } from 'vue'

import CodeBlock from './CodeBlock.vue'

const props = defineProps({
  content: {
    type: [Object, String] as PropType<object | string>,
    required: true,
  },

  queryKey: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'refresh'): void
}>()
</script>

<style lang="scss" scoped>
.envoy-data-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: var(--spacing-md);
}
</style>
