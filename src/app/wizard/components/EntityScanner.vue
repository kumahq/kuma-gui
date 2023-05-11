<template>
  <div class="scanner">
    <div class="scanner-content">
      <KEmptyState cta-is-hidden>
        <template #title>
          <div class="mb-2">
            <KIcon
              v-if="isRunning"
              icon="spinner"
              color="var(--grey-300)"
              size="42"
            />

            <KIcon
              v-else-if="hasError"
              icon="errorFilled"
              color="var(--red-500)"
              size="42"
            />

            <KIcon
              v-else
              icon="circleCheck"
              color="var(--green-500)"
              size="42"
            />
          </div>

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
