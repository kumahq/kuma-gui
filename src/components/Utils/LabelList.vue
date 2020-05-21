<template>
  <div class="label-list">
    <div
      v-if="isReady"
      class="label-list-content"
    >
      <KCard
        v-if="!isLoading && !isEmpty"
        border-variant="noBorder"
      >
        <template slot="body">
          <div class="label-list__col-wrapper multi-col">
            <slot />
          </div>
        </template>
      </KCard>
    </div>

    <!-- loading state -->
    <KEmptyState
      v-if="isLoading"
      cta-is-hidden
    >
      <template slot="title">
        <div class="card-icon mb-3">
          <KIcon
            icon="spinner"
            color="rgba(0, 0, 0, 0.1)"
            size="42"
          />
        </div>
        Data Loading...
      </template>
    </KEmptyState>

    <!-- no data to load -->
    <KEmptyState
      v-if="isEmpty && !isLoading"
      cta-is-hidden
    >
      <template slot="title">
        <div class="card-icon mb-3">
          <KIcon
            class="kong-icon--centered"
            color="var(--yellow-base)"
            icon="warning"
            size="42"
          />
        </div>
        There is no data to display.
      </template>
    </KEmptyState>

    <!-- error -->
    <KEmptyState
      v-if="hasError"
      cta-is-hidden
    >
      <template slot="title">
        <div class="card-icon mb-3">
          <KIcon
            class="kong-icon--centered"
            color="var(--yellow-base)"
            icon="warning"
            size="42"
          />
        </div>
        An error has occurred while trying to load this data.
      </template>
    </KEmptyState>
  </div>
  </div>
</template>

<script>
import { rejectKeys } from '@/views/Wizard/helpers'

export default {
  name: 'LabelList',
  props: {
    items: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    hasError: {
      type: Boolean,
      default: false
    },
    isEmpty: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isReady () {
      return !this.isEmpty && !this.hasError && !this.isLoading
    },
    itemsNoTags () {
      return rejectKeys(this.items, 'tags')
    }
  }
}
</script>

<style lang="scss">
.label-list-content {

  .kong-card {
    margin-bottom: 0 !important;
  }
}

.label-list {

}

.label-list__col-wrapper {

  ul {

    h1, h2, h3, h4, h5, h6 {
      font-size: var(--type-sm);
      font-weight: 500;
      text-transform: uppercase;
      color: var(--gray-3);
      margin-bottom: var(--spacing-xs);
    }

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

.label-list__items__value {
  // font-size: var(--type-sm);
  // font-family: var(--font-family-mono);
}

.tag-cols {
  display: grid;
  grid-auto-flow: column dense;
  grid-gap: 10px;
  grid-template-columns: repeat(2, 1fr 4fr);

  span {
    // flex: 1 0 0;
  }
}

.tag-cols__label {
  min-width: 80px;
  font-weight: 700;
  text-align: right;
}

.tag-cols__value {

}
</style>
