<template>
  <div
    :class="{ disabled:isDisabled }"
    class="form-inline time-frame-picker d-flex justify-content-end pr-0 mb-2"
  >
    <span class="hidden-md-down mr-2 timeframe-label">Timeframe:</span>
    <select
      v-model="timeFrame"
      :disabled="isDisabled"
      class="time-frame-select form-control"
    >
      <option
        v-for="(option, idx) in timeFrames"
        :key="idx"
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>
    <div
      v-if="showUtc"
      class="ml-2 utc-picker"
    >
      <label class="form-check-label">
        <input
          v-model="isUtc"
          class="form-check-input"
          type="checkbox"
          @change="onUtcChange"
        >
        UTC
      </label>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TimeFramePicker',

  props: {
    updateControls: {
      type: Function,
      required: true
    },

    isDisabled: {
      type: Boolean,
      default: false
    },

    showUtc: {
      type: Boolean,
      default: true
    },

    featureName: {
      type: String,
      default: 'vitals'
    },

    options: {
      type: Array,
      required: true
    }

  },

  data () {
    return {
      isUtc: null,
      timeFrame: null,
      timeFrames: this.options
    }
  },
  computed: {
    utcStorageKey () {
      return `kong_${this.featureName}_utc`
    },
    timeFrameStorageKey () {
      return `kong_${this.featureName}_time_frame`
    }
  },
  watch: {
    timeFrame: {
      handler: function () {
        this.onTimeFrameChange()
      }
    }
  },
  mounted () {
    try {
      this.isUtc = localStorage.getItem(this.utcStorageKey) === 'true'
    } catch (e) {
      this.isUtc = false
    }

    this.onUtcChange()

    try {
      const savedTimeFrameLength = Number(localStorage.getItem(this.timeFrameStorageKey))

      this.timeFrame = this.timeFrames.reduce((acc, timeFrame) => {
        if (timeFrame.value.timeFrameLength === savedTimeFrameLength) {
          acc = timeFrame.value
        }

        return acc
      }, this.timeFrames[0].value)
    } catch (e) {
      this.timeFrame = this.timeFrames[0].value
    }

    this.onTimeFrameChange()
  },

  methods: {
    onUtcChange () {
      try {
        localStorage.setItem(this.utcStorageKey, this.isUtc)
      } catch (e) {
        console.error(e)
      }

      this.updateControls('isUtc', this.isUtc)
    },

    onTimeFrameChange () {
      try {
        localStorage.setItem(this.timeFrameStorageKey, this.timeFrame.timeFrameLength)
      } catch (e) {
        console.error(e)
      }

      this.updateControls('timeFrame', this.timeFrame)
    }
  }
}
</script>

<style lang="scss" scoped>
  .time-frame-select, .time-frame-select:focus {
    background-color: rgba(245, 245, 245, 1.0);
  }

  .disabled label {
    opacity: 1;
    cursor: not-allowed;
  }

  .utc-picker {
    color: #464a4c;
    height: calc(2.25rem + 2px);
    padding: 0.375rem 0.75rem 0.375rem 0.75rem;
    margin: 0px;
    line-height: 1.25;
    border-radius: 3px;
    background-color: rgba(245, 245, 245, 1.0);
    border: 1px solid rgba(0, 0, 0, 0.12);
  }
</style>
