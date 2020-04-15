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
          <div
            v-if="isComplete && hasError === false && isRunning === false"
            class="card-icon mb-3"
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
        <template slot="message">
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
import IconSuccess from '@/components/Utils/IconSuccess'

export default {
  name: 'Scanner',
  components: {
    IconSuccess
  },
  props: {
    interval: {
      type: Number,
      required: false,
      default: 1000 // 1000ms = 1s
    },
    retries: {
      type: Number,
      required: false,
      default: 3600 // 3600s = 1h
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
    },
    canComplete: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      i: 0,
      isRunning: false,
      isComplete: false
    }
  },
  watch: {
    shouldStart (val, oldVal) {
      if (val !== oldVal && val === true) {
        this.runScanner()
      }
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
      this.isRunning = true
      this.isComplete = false

      // setup the interval function
      const intervalFunction = setInterval(() => {
        this.i++

        // run our function
        this.loaderFunction()

        // complete the cycle if the scanner has reached the max
        // amount of retries, or if the process has been marked complete
        if (this.i === this.retries || this.canComplete === true) {
          clearInterval(intervalFunction)
          this.isRunning = false
          this.isComplete = true
        }
      }, this.interval)
    }
  }
}
</script>

<style lang="scss">
// style override for the KEmptyState content
.scanner-content {

  .empty-state-wrapper p {
    max-width: 100% !important;
  }
}
</style>

<style lang="scss" scoped>
.scanner {

}

.scanner-content {

  p {
    border: 1px solid red;
    margin: 0;
  }

  .card-icon {
    text-align: center;

    img, svg {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
  }

  .empty-state-wrapper.empty-state-wrapper p {
    max-width: 100% !important;
  }
}
</style>
