<template>
  <div
    v-if="shouldStart"
    class="scanner"
  >
    <div class="scanner-content">
      <!-- loading state -->
      <KEmptyState cta-is-hidden>
        <template #title>
          <div
            v-if="isRunning"
            class="mb-3"
          >
            <KIcon
              icon="spinner"
              color="rgba(0, 0, 0, 0.1)"
              size="42"
            />
          </div>
          <div
            v-if="isComplete && hasError === false && isRunning === false"
            class="mb-3"
          >
            <IconSuccess />
          </div>
          <slot
            v-if="isRunning"
            name="loading-title"
          />
          <div v-if="isRunning === false">
            <slot
              v-if="hasError"
              name="error-title"
            />
            <slot
              v-if="isComplete && hasError === false"
              name="complete-title"
            />
          </div>
        </template>
        <template #message>
          <slot
            v-if="isRunning"
            name="loading-content"
          />
          <div v-if="isRunning === false">
            <slot
              v-if="hasError"
              name="error-content"
            />
            <slot
              v-if="isComplete && hasError === false"
              name="complete-content"
            />
          </div>
        </template>
      </KEmptyState>
    </div>
  </div>
</template>

<script>
import { KEmptyState, KIcon } from '@kong/kongponents'
import IconSuccess from '@/app/common/IconSuccess.vue'

export default {
  name: 'EntityScanner',
  components: {
    IconSuccess,
    KEmptyState,
    KIcon,
  },
  props: {
    interval: {
      type: Number,
      required: false,
      default: 1000, // 1000ms = 1s
    },
    retries: {
      type: Number,
      required: false,
      default: 3600, // 3600s = 1h
    },
    shouldStart: {
      type: Boolean,
      default: false,
    },
    hasError: {
      type: Boolean,
      default: false,
    },
    loaderFunction: {
      type: Function,
      required: true,
    },
    canComplete: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['hide-siblings'],

  data() {
    return {
      i: 0,
      isRunning: false,
      isComplete: false,
      intervalId: null,
    }
  },
  watch: {
    shouldStart(val, oldVal) {
      if (val !== oldVal && val === true) {
        this.runScanner()
      }
    },
  },
  mounted() {
    // only run the function when instructed to
    if (this.shouldStart === true) {
      this.runScanner()
    }
  },
  beforeUnmount() {
    clearInterval(this.intervalId)
  },
  methods: {
    runScanner() {
      this.isRunning = true
      this.isComplete = false

      // setup the interval function
      this.intervalId = setInterval(() => {
        this.i++

        // run our function
        this.loaderFunction()

        // complete the cycle if the scanner has reached the max
        // amount of retries, or if the process has been marked complete
        if (this.i === this.retries || this.canComplete === true) {
          clearInterval(this.intervalId)
          this.isRunning = false
          this.isComplete = true

          this.$emit('hide-siblings', true)
        }
      }, this.interval)
    },
  },
}
</script>

<style lang="scss" scoped>
.scanner-content p {
  border: 1px solid red;
  margin: 0;
}
</style>
