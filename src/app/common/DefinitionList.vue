<template>
  <LoadingBlock v-if="props.isLoading" />

  <ErrorBlock v-else-if="props.hasError" />

  <EmptyBlock v-else-if="props.isEmpty" />

  <dl
    v-else
    class="definition-list"
  >
    <slot />
  </dl>
</template>

<script lang="ts" setup>
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },

  hasError: {
    type: Boolean,
    default: false,
  },

  isEmpty: {
    type: Boolean,
    default: false,
  },
})
</script>

<style lang="scss" scoped>
.definition-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
</style>
