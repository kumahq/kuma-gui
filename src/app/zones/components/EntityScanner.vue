<template>
  <div
    class="scanner"
    :data-test-state="isRunning ? 'waiting' : hasError ? 'error' : 'success'"
  >
    <div class="scanner-content">
      <KEmptyState cta-is-hidden>
        <template #title>
          <span class="mr-1">
            <ProgressIcon
              v-if="isRunning"
              :color="KUI_COLOR_TEXT_NEUTRAL_WEAK"
            />

            <DangerIcon
              v-else-if="hasError"
              :color="KUI_COLOR_TEXT_DANGER"
            />

            <CheckCircleIcon
              v-else
              :color="KUI_COLOR_TEXT_SUCCESS"
            />
          </span>

          <slot
            v-if="isRunning"
            name="loading-title"
          />

          <slot
            v-else-if="hasError"
            name="error-title"
          />

          <slot
            v-else
            name="complete-title"
          />
        </template>

        <template #message>
          <slot
            v-if="isRunning"
            name="loading-content"
          />

          <slot
            v-else-if="hasError"
            name="error-content"
          />

          <slot
            v-else
            name="complete-content"
          />
        </template>
      </KEmptyState>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KUI_COLOR_TEXT_NEUTRAL_WEAK, KUI_COLOR_TEXT_DANGER, KUI_COLOR_TEXT_SUCCESS } from '@kong/design-tokens'
import { ProgressIcon, CheckCircleIcon, DangerIcon } from '@kong/icons'
import { onBeforeUnmount, onMounted, ref } from 'vue'

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

const numberOfCalls = ref(0)
const isRunning = ref(false)
const isComplete = ref(false)
const intervalId = ref<number | null>(null)

onMounted(function () {
  runScanner()
})

onBeforeUnmount(function () {
  clearScannerInterval()
})

function runScanner() {
  isRunning.value = true
  isComplete.value = false

  clearScannerInterval()

  intervalId.value = window.setInterval(async () => {
    numberOfCalls.value++
    await props.loaderFunction()

    if (numberOfCalls.value === props.retries || props.canComplete === true) {
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
