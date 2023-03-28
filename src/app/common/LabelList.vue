<template>
  <div class="label-list">
    <LoadingBlock v-if="props.isLoading" />

    <ErrorBlock v-else-if="props.hasError" />

    <EmptyBlock v-else-if="props.isEmpty" />

    <div
      v-else
      class="label-list__content"
    >
      <slot />
    </div>
  </div>
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

<style lang="scss">
.label-list {
  h2, h3, h4, h5, h6 {
    margin-bottom: var(--spacing-xs);
    color: var(--grey-500);
  }

  h2, h3, h4 {
    text-transform: uppercase;
  }
}

.label-list__content {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  row-gap: var(--spacing-lg);

  > * {
    flex-grow: 999;
    flex-basis: 0;
    min-inline-size: 500px;
  }

  li:not(:first-child) {
    margin-top: var(--spacing-md);
  }
}
</style>
