<template>
  <div class="data-overview">
    <MetricGrid
      v-if="!isLoading && displayMetrics && metricsData"
      :metrics="metricsData"
    />
    <KEmptyState
      v-if="isLoading"
      cta-is-hidden
    >
      <template v-slot:title>
        {{ emptyState.title }}
      </template>
      <template
        v-if="showCta"
        v-slot:message
      >
        <router-link
          v-if="ctaAction && ctaAction.length"
          :to="ctaAction"
        >
          {{ emptyState.ctaText }}
        </router-link>
        {{ emptyState.message }}
      </template>
    </KEmptyState>
    <div v-if="isReady">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
import MetricGrid from '@/components/Metrics/MetricGrid'

export default {
  name: 'DataOverview',
  components: {
    MetricGrid
  },
  props: {
    displayMetrics: {
      type: Boolean,
      default: false
    },
    metricsData: {
      type: Array,
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
    },
    emptyState: {
      type: Object,
      default: null
    },
    ctaAction: {
      type: Object,
      default: () => {}
    },
    showCta: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isReady () {
      return !this.isEmpty && !this.hasError && !this.isLoading
    }
  }
}
</script>

<style lang="scss">
.empty-state-title {

  .card-icon {
    text-align: center;

    img {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
</style>
