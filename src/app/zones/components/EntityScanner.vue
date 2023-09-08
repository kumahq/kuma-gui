<template>
  <div
    class="scanner"
    :data-test-state="isRunning ? 'waiting' : hasError ? 'error' : 'success'"
  >
    <div class="scanner-content">
      <KEmptyState cta-is-hidden>
        <template #title>
          <span class="mr-1">
            <KIcon
              v-if="isRunning"
              icon="spinner"
              :color="KUI_COLOR_TEXT_NEUTRAL_WEAK"
              :size="KUI_ICON_SIZE_50"
            />

            <KIcon
              v-else-if="hasError"
              icon="errorFilled"
              :color="KUI_COLOR_TEXT_DANGER"
              :size="KUI_ICON_SIZE_50"
            />

            <KIcon
              v-else
              icon="circleCheck"
              :color="KUI_COLOR_TEXT_SUCCESS"
              :size="KUI_ICON_SIZE_50"
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
import { KUI_COLOR_TEXT_NEUTRAL_WEAK, KUI_COLOR_TEXT_DANGER, KUI_COLOR_TEXT_SUCCESS, KUI_ICON_SIZE_50 } from '@kong/design-tokens'
import { KEmptyState, KIcon } from '@kong/kongponents'
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
