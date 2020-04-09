<template>
  <div class="scanner">
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
        <slot name="loading-title" />
      </template>
      <template slot="message">
        <slot name="loading-content" />
      </template>
    </KEmptyState>
    <!-- complete state -->
    <KEmptyState
      v-if="isComplete"
      cta-is-hidden
    >
      <template slot="title">
        <slot name="complete-title" />
      </template>
      <template slot="message">
        <slot name="complete-content" />
      </template>
    </KEmptyState>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    interval: {
      type: Number,
      required: true
    },
    retries: {
      type: Number,
      required: false,
      default: 3
    }
  },
  data () {
    return {
      isLoading: true,
      isComplete: false,
      error: false
    }
  },
  methods: {
    runScanner () {

    }
  }
}
</script>

<style lang="scss" scoped>
.scanner {

}
</style>
