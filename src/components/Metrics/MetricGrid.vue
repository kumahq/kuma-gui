<template>
  <div
    v-if="metrics"
    class="info-grid"
    :class="{ 'is-compact': isCompact }"
  >
    <div
      v-for="(metric, index) in metrics"
      v-if="metric.value !== null"
      :key="index"
      :data-testid="metric.metric"
      :class="metric.status"
      class="metric"
    >
      <router-link
        v-if="metric.url"
        :to="metric.url"
        class="metric-card"
      >
        <span class="metric-title">
          {{ metric.metric }}
        </span>
        <span
          :class="{ 'has-error': index === hasError[index] }"
          class="metric-value"
        >
          {{ metric.value | formatValue | formatError }}
        </span>
      </router-link>
      <div
        v-else
        class="metric-card"
      >
        <span class="metric-title">
          {{ metric.metric }}
        </span>
        <span
          :class="{ 'has-error': index === hasError[index] }"
          class="metric-value"
        >
          {{ metric.value | formatValue | formatError }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetricsGrid',

  filters: {
    formatValue (value) {
      return value ? value.toLocaleString('en').toString() : 0
    },

    formatError (value) {
      if (value === '--') {
        return 'error calculating'
      }

      return value
    }
  },

  props: {
    metrics: {
      // type: Object,
      type: Array,
      required: true,
      default: () => {}
    },
    isCompact: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    hasError () {
      const errors = {}

      Object.keys(this.metrics).forEach(key => {
        if (this.metrics[key].value === '--') {
          errors[key] = key
        }
      })

      return errors
    }
  }
}
</script>

<style lang="scss" scoped>
.info-grid {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  margin: 2rem -0.5rem;
  padding: 0;

  .metric {
    display: flex;
    flex-grow: 1;
    flex-shrink: 0;
    flex-direction: column;
    justify-content: space-between;

    .metric-card {
      display: block;
      text-decoration: none;
      text-align: left;
      border-left: 3px solid;
      border-left-color: rgba(0,0,0,.1);
      background-color: rgba(150,58,133,0.05);
      padding: 16px 26px;
      margin: 0.5rem;
    }

    a.metric-card:hover,
    a.metric-card:active,
    a.metric-card:focus {
      // border-left-color: var(--brand-color-6);
      background-color: var(--blue-3);

      .metric-title {
        color: #000;
        text-decoration: underline;
      }
    }

    span {
      display: block;
    }

    .metric-title {
      font-size: 16px;
      color: rgba(0,0,0,.45);
    }

    .metric-value {
      font-weight: 400;
      font-size: 28px;
      color: rgba(0,0,0,.75);

      &:last-child {
        margin-bottom: auto;
      }

      &.has-error {
        font-size: 14px;
        font-weight: 400;
        margin-top: auto;
      }
    }

    &.danger {
      border-color: #E6B8B8;

      .metric-value {
        color: #D90000;
      }
    }
  }

  // Compact

  &.is-compact {

    .metric {

      .metric-card {
        margin: 0.25rem;
        padding: 10px 14px;
      }

      .metric-title {
        font-size: var(--type-sm);
      }

      .metric-value {
        font-size: var(--type-lg);
      }
    }
  }

  @media only screen and (max-width: 840px) {
    flex-direction: column;

    .metric {
      flex: none;
      margin-bottom: 0;

      .metric-card {
        margin-bottom: 0.25rem;
      }
    }
  }

  @media only screen and (min-width: 841px) {
    flex-wrap: wrap;

    .metric {
      --i: 33.333333%;

      flex: 0 0 var(--i);
      min-width: var(--i);
    }
  }
}
</style>
