<template>
  <div
    v-if="shouldStart"
    class="scanner"
  >
    <div class="scanner-content">
      <!-- loading state -->
      <KEmptyState cta-is-hidden>
        <template slot="title">
          <div
            v-if="isRunning"
            class="card-icon mb-3"
          >
            <KIcon
              icon="spinner"
              color="rgba(0, 0, 0, 0.1)"
              size="42"
            />
          </div>
          <slot
            v-if="isRunning"
            name="loading-title"
          />
          <slot
            v-if="hasError"
            name="error-title"
          />
          <slot
            v-if="isComplete"
            name="complete-title"
          />
          <slot
            v-if="hasTimedOut"
            name="timeout-title"
          />
        </template>
        <template slot="message">
          <slot
            v-if="isRunning"
            name="loading-content"
          />
          <slot
            v-if="hasError"
            name="error-content"
          />
          <slot
            v-if="isComplete"
            name="complete-content"
          />
          <slot
            v-if="hasTimedOut"
            name="timeout-content"
          />
        </template>
      </KEmptyState>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    interval: {
      type: Number,
      required: false,
      default: 1000 // milliseconds
    },
    retries: {
      type: Number,
      required: false,
      default: 10
    },
    shouldStart: {
      type: Boolean,
      default: false
    },
    hasError: {
      type: Boolean,
      default: false
    },
    loaderFunction: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      i: 0,
      isRunning: false,
      isComplete: false,
      hasTimedOut: false
    }
  },
  mounted () {
    // only run the function when instructed to
    if (this.shouldStart === true) {
      this.runScanner()
    }
  },
  methods: {
    runScanner () {
      // setup the interval function
      const intervalFunction = setInterval(() => {
        this.i++
        this.isRunning = true

        // run our function
        this.loaderFunction()

        // emitter for when the scanner is running
        this.$emit('entityScannerRunning')

        if (this.i === this.retries) {
          clearInterval(intervalFunction)
          this.isRunning = false

          if (this.isComplete === false) {
            this.hasTimedOut = true
            this.$emit('entityScannerTimedOut')
          } else {
            this.isComplete = true
            this.$emit('entityScannerComplete')
          }
        }

        if (this.hasError === true) {
          clearInterval(intervalFunction)

          // emitter for when an error occurs
          this.$emit('entityScannerError')
        }
      }, this.interval)
    }
  }
}
</script>

<style lang="scss" scoped>
.scanner {

}
</style>
