<template>
  <div class="loader-card">
    <div
      v-if="isReady"
      class="loader-card-content"
    >
      <KCard
        v-if="!isLoading && !isEmpty"
        border-variant="noBorder"
      >
        <template #body>
          <slot />
        </template>
      </KCard>
    </div>

    <!-- loading state -->
    <KEmptyState
      v-if="isLoading"
      cta-is-hidden
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
            color="var(--yellow-200)"
            icon="warning"
            secondary-color="var(--black-75)"
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
            color="var(--yellow-200)"
            icon="warning"
            secondary-color="var(--black-75)"
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
  name: 'LoaderCard',
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
  computed: {
    isReady() {
      return !this.isEmpty && !this.hasError && !this.isLoading
    },
  },
}
</script>

<style lang="scss">
.loader-card {
}

.loader-card-content {
}
</style>
