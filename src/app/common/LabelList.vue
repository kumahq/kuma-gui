<template>
  <div>
    <LoadingBlock v-if="props.isLoading" />

    <ErrorBlock v-else-if="props.hasError" />

    <EmptyBlock v-else-if="props.isEmpty" />

    <div
      v-else
      class="label-list-content"
    >
      <KCard border-variant="noBorder">
        <template #body>
          <div class="label-list__col-wrapper multi-col">
            <slot />
          </div>
        </template>
      </KCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'

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
.label-list-content .kong-card {
  margin-bottom: 0 !important;
}

.label-list__col-wrapper {
  h4 {
    margin-bottom: var(--spacing-xs);
    text-transform: uppercase;
    color: var(--grey-500);
  }

  li:not(:first-child) {
    margin-top: var(--spacing-md);
  }

  @media screen and (min-width: 1024px) {
    &.multi-col {
      display: flex;

      > * {
        flex-grow: 1;
        flex-basis: 33.333333%;

        &:not(:last-of-type) {
          margin-right: var(--spacing-md);
        }
      }
    }
  }
}

// Tag columns

.tag-cols {
  display: grid;
  grid-auto-flow: column dense;
  grid-template-columns: 1fr 2fr;

  span {
    display: inline-block;
    padding: var(--spacing-xs);
  }

  span:first-of-type {
    font-weight: bold;
  }
}

// Label columns

.label-cols {
  display: flex;
  align-items: stretch;

  span:first-of-type {
    &:after {
      display: inline-block;
      content: '/';
      margin: 0 3px 0 1px;
      color: var(--grey-500);
    }
  }
}
</style>
