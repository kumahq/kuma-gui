<template>
  <div>
    <div v-if="isReady">
      <slot />
    </div>

    <!-- loading state -->
    <KEmptyState
      v-if="isLoading"
      cta-is-hidden
      data-testid="status-info-loading-section"
    >
      <template #title>
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
      <template #title>
        <div class="card-icon mb-3">
          <KIcon
            class="kong-icon--centered"
            icon="warning"
            color="var(--black-75)"
            secondary-color="var(--yellow-300)"
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
      <template #title>
        <div class="card-icon mb-3">
          <KIcon
            class="kong-icon--centered"
            icon="warning"
            color="var(--black-75)"
            secondary-color="var(--yellow-300)"
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
  name: 'StatusInfo',
  props: {
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
