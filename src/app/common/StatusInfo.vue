<template>
  <div>
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
import { PropType } from 'vue'

import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'

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
    type: [Error, null] as PropType<Error | null>,
    required: false,
    default: null,
  },
})
</script>
