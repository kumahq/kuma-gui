<template>
  <div class="status-info">
    <LoadingBlock v-if="isLoading" />

    <ErrorBlock
      v-else-if="hasError"
      :error="error"
    />

    <EmptyBlock v-else-if="isEmpty" />

    <div v-else>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import EmptyBlock from '../EmptyBlock.vue'
import ErrorBlock from '@/components/ErrorBlock.vue'
import LoadingBlock from '@/components/LoadingBlock.vue'
import { ApiError } from '@/services/ApiError'

defineProps({
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

  error: {
    type: [Error, ApiError],
    required: false,
    default: null,
  },
})
</script>

<style lang="scss">
.k-empty-state-message {
  text-align: left;
}
</style>

<style lang="scss" scoped>
.status-info {
  position: relative;
}
</style>
