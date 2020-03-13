<template>
  <div class="label-list">
    <div
      v-if="isReady"
      class="label-list-content"
    >
      <KCard
        v-if="!isLoading && !isEmpty"
        :title="title"
        border-variant="noBorder"
      >
        <template slot="body">
          <ul class="label-list__items">
            <li
              v-for="(value, key) in items"
              :key="key"
            >
              <h4 class="label-list__items__title">
                {{ key }}
              </h4>
              <p class="label-list__items__value">
                {{ value }}
              </p>
            </li>
          </ul>
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
    }
  }
}
</script>

<style lang="scss" scoped>
.label-list {

}

.label-list__items {

  li {
    display: block;

    &:not(:last-of-type) {
      margin-bottom: var(--spacing-md);
    }
  }

  &.has-columns {

  }
}

.label-list__items__title {
  font-size: var(--type-sm);
  font-weight: 700;
  text-transform: uppercase;
  color: var(--gray-3);
}

.label-list__items__value {
  font-size: var(--type-lg);
  font-family: var(--font-family-mono);
}
</style>
