<template>
  <div class="loader-card">
    <LoadingBlock v-if="isLoading" />

    <ErrorBlock v-else-if="hasError" />

    <EmptyBlock v-else-if="isEmpty" />

    <div
      v-else
      class="loader-card-content"
    >
      <KCard border-variant="noBorder">
        <template #body>
          <slot />
        </template>
      </KCard>
    </div>
  </div>
</template>

<script>
import { KCard } from '@kong/kongponents'

import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'

export default {
  name: 'LoaderCard',

  components: {
    EmptyBlock,
    ErrorBlock,
    LoadingBlock,
    KCard,
  },

  props: {
    title: {
      type: String,
      default: null,
    },

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
  },
}
</script>
