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
.label-list-content {
  .kong-card {
    margin-bottom: 0 !important;
  }
}

.label-list__col-wrapper {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: var(--type-sm);
    font-weight: 500;
    text-transform: uppercase;
    color: var(--gray-3);
    margin-bottom: var(--spacing-xs);
  }

  ul {
    li {
      display: block;
      overflow: hidden;

      &:not(:last-of-type) {
        margin-bottom: var(--spacing-md);
      }
    }
  }

  @media screen and (min-width: 1024px) {
    &.multi-col {
      display: flex;

      > * {
        // flex: 1 0 0;
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
  // grid-gap: 10px;
  grid-template-columns: 1fr 2fr;

  span {
    display: inline-block;
    padding: var(--spacing-xs);
    // border-bottom: 1px solid var(--gray-4);
  }

  span:first-of-type {
    // min-width: 80px;
    font-weight: 700;
  }

  span:last-of-type {
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
      color: #999;
    }
  }
}
</style>
