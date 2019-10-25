<template>
  <div v-if="metrics" class="info-grid">
    <div
      v-for="(metric, index) in metrics"
      v-if="metric.value !== null"
      :data-testid="metric.metric"
      :key="index"
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
  name: "MetricsGrid",

  filters: {
    formatValue(value) {
      return value ? value.toLocaleString("en").toString() : 0;
    },

    formatError(value) {
      if (value === "--") {
        return "error calculating";
      }

      return value;
    }
  },

  props: {
    metrics: {
      type: Object,
      required: true,
      default: () => {}
    }
  },

  computed: {
    hasError() {
      let errors = {};

      Object.keys(this.metrics).forEach(key => {
        if (this.metrics[key].value === "--") {
          errors[key] = key;
        }
      });

      return errors;
    }
  }
};
</script>

<style lang="scss">
.info-grid {
  display: flex;
  width: 100%;
  margin: 0 auto 2rem;
  padding: 2rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);

  .metric {
    display: flex;
    flex: 1;
    flex-shrink: 0;
    flex-direction: column;
    justify-content: space-between;
    text-align: left;
    border-left: 3px solid;
    padding-left: 20px;
    border-color: rgba(0, 0, 0, 0.1);
    .metric-title {
      color: rgba(0, 0, 0, 0.45);
    }
    .metric-value {
      font-weight: 500;
      font-size: 24px;
      color: rgba(0, 0, 0, 0.7);
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
      border-color: #e6b8b8;
      .metric-value {
        color: #d90000;
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
}
</style>
