<template>
  <div
    v-if="metrics"
    class="info-grid"
  >
    <div
      v-for="(metric, index) in metrics"
      v-if="metric.value !== null"
      :key="index"
      :data-testid="metric.metric"
      :class="metric.status"
      class="metric"
    >
      <span class="metric-title">{{ metric.metric }}</span>
      <span
        :class="{'has-error': index === hasError[index]}"
        class="metric-value"
      >{{ metric.value | formatValue | formatError }}</span>
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

<style lang="scss">
.info-grid {
  display: flex;
  width: 100%;
  margin: 0 -16px 2em -16px;
  padding: 2rem 0;
  // border-top: 1px solid rgba(0,0,0,.10);

  .metric {
    display: flex;
    flex: 1;
    flex-shrink: 0;
    flex-direction: column;
    justify-content: space-between;
    text-align: left;
    border-left: 3px solid;
    padding: 16px 26px;
    border-color: rgba(0,0,0,.1);
    background-color: rgba(150,58,133,0.05);
    margin: 0 16px 16px 16px;

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

  @media only screen and (max-width: 840px) {
    flex-direction: column;
    .metric {
      flex: none;
      margin-bottom: 1rem;
    }
  }

  @media only screen and (min-width: 841px) {
    flex-wrap: wrap;

    .metric {
      flex: 0 0 calc(33.33% - 32px); // gutter = 16px
    }
  }
}
</style>
