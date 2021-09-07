<template>
  <div>
    <div
      v-if="isReady"
      class="label-list-content"
    >
      <KCard
        v-if="!isLoading && !isEmpty"
        border-variant="noBorder"
      >
        <template v-slot:body>
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
      <template v-slot:title>
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
      <template v-slot:title>
        <div class="card-icon mb-3">
          <KIcon
            class="kong-icon--centered"
            color="var(--yellow-200)"
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
      <template v-slot:title>
        <div class="card-icon mb-3">
          <KIcon
            class="kong-icon--centered"
            color="var(--yellow-200)"
            icon="warning"
            size="42"
          />
        </div>
        An error has occurred while trying to load this data.
      </template>
    </KEmptyState>
  </div>
</template>

<script>
export default {
  name: 'LabelList',
  props: {
    items: {
      type: Object,
      default: null,
    },
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
  computed: {
    isReady() {
      return !this.isEmpty && !this.hasError && !this.isLoading
    },
  },
}
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
