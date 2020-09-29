<template>
  <KCard
    v-if="metrics"
    class="info-grid-wrapper mb-4"
  >
    <template slot="body">
      <div
        class="info-grid"
        :class="metricCountClass"
      >
        <div
          v-for="(metric, index) in metrics"
          v-if="metric.value !== null"
          :key="index"
          :data-testid="metric.metric | formatTestId"
          :class="metric.status"
          class="metric"
        >
          <router-link
            v-if="metric.url"
            :to="metric.url"
            class="metric-card"
          >
            <div class="metric-title color-black-85 font-semibold">
              {{ metric.metric }}
            </div>
            <span
              :class="{ 'has-error': index === hasError[index], 'has-extra-label': metric.extraLabel }"
              class="metric-value mt-2 type-xl"
            >
              {{ metric.value | formatValue | formatError }}
              <em
                v-if="metric.extraLabel"
                class="metric-extra-label"
              >
                {{ metric.extraLabel }}
              </em>
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
  </KCard>
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
    },

    formatTestId (value) {
      return value
        .replace(' ', '-')
        .toLowerCase()
    }
  },

  props: {
    metrics: {
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
    },

    metricCountClass () {
      const count = this.metrics.length
      const prefix = 'metric-count--'

      if (count % 3) {
        return `${prefix}odd`
      }

      return `${prefix}even`
    }
  }
}
</script>

<style lang="scss" scoped>
.info-grid-wrapper {
  --KCardPaddingY: 0;
  --KCardPaddingX: 0;
}

.info-grid {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  // margin: 2rem -0.5rem;
  padding: 0;

  .metric {
    --border: 1px solid var(--black-10);

    display: flex;
    flex-grow: 1;
    flex-shrink: 0;
    flex-direction: column;
    justify-content: space-between;
    border-bottom: var(--border);

    @media (max-width: 840px) {
      &:last-child {
        border-bottom: 0;
      }
    }

    @media (min-width: 841px) {
      border-right: var(--border);

      &:nth-child(3n) {
        border-right: 0;
      }
    }

    .metric-card {
      display: block;
      text-decoration: none;
      text-align: center;
      // text-align: left;
      // border-left: 3px solid;
      // border-left-color: rgba(0,0,0,.1);
      // background-color: rgba(150,58,133,0.05);
      padding: 16px 26px;
      // margin: 0.5rem;
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
      // font-size: 16px;
      // color: rgba(0,0,0,.45);
    }

    .metric-value {
      // font-weight: 400;
      // font-size: 28px;
      color: rgba(0,0,0,.85);

      &:last-child {
        margin-bottom: auto;
      }

      &.has-error {
        font-size: 14px;
        font-weight: 400;
        margin-top: auto;
      }

      &.has-extra-label {
        display: flex;
        align-items: center;
      }
    }

    .metric-extra-label {
      font-style: normal;
      font-size: 18px;
      color: var(--tblack-45);
      margin-left: 8px;
    }

    &.danger {
      border-color: #E6B8B8;

      .metric-value {
        color: #D90000;
      }
    }
  }

  @media (min-width: 841px) {
    &.metric-count--odd {

      .metric:nth-last-child(-n+2) {
        border-bottom: 0;
      }
    }

    &.metric-count--even {

      .metric:nth-last-child(-n+3) {
        border-bottom: 0;
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
