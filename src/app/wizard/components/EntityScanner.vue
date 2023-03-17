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

<script lang="ts" setup>
import { KEmptyState, KIcon } from '@kong/kongponents'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import IconSuccess from '@/app/common/IconSuccess.vue'

const props = defineProps({
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
})

const emit = defineEmits<{
  (event: 'hide-siblings', shouldHideSiblings: boolean): void
}>()

const i = ref(0)
const isRunning = ref(false)
const isComplete = ref(false)
const intervalId = ref<number | null>(null)

watch(() => props.shouldStart, function (val, oldVal) {
  if (val !== oldVal && val === true) {
    runScanner()
  }
})

onMounted(function () {
  // only run the function when instructed to
  if (props.shouldStart === true) {
    runScanner()
  }
})

onBeforeUnmount(function () {
  clearScannerInterval()
})

function runScanner() {
  isRunning.value = true
  isComplete.value = false

  // setup the interval function
  clearScannerInterval()
  intervalId.value = window.setInterval(() => {
    i.value++

    // run our function
    props.loaderFunction()

    // complete the cycle if the scanner has reached the max
    // amount of retries, or if the process has been marked complete
    if (i.value === props.retries || props.canComplete === true) {
      clearScannerInterval()

      isRunning.value = false
      isComplete.value = true

      emit('hide-siblings', true)
    }
  }, props.interval)
}

function clearScannerInterval() {
  if (intervalId.value !== null) {
    window.clearInterval(intervalId.value)
  }
}
</script>

<style lang="scss" scoped>
.scanner-content p {
  border: 1px solid red;
  margin: 0;
}
</style>
