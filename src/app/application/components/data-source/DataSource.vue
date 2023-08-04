<template>
  <slot
    :data="(message as any)"
    :is-loading="isLoading"
    :error="error"
    :refresh="refresh"
  />

  <span class="visually-hidden" />
</template>

<script lang="ts" setup>
import { watch, ref, onBeforeUnmount } from 'vue'

import { useDataSourcePool } from '@/utilities'

const data = useDataSourcePool()

const props = defineProps({
  src: {
    type: String,
    required: true,
  },

  shouldMakeRequest: {
    type: Boolean,
    default: true,
  },
})

const message = ref<unknown>(undefined)
const isLoading = ref(false)
const error = ref<Error | undefined>(undefined)

const emit = defineEmits<{
  (e: 'change', value: any): void
  (e: 'error', error: Error): void
}>()

type State = {
  controller?: AbortController
  src?: string
}
let state: State = {}
const sym = Symbol('')
const open = async (src: string) => {
  message.value = undefined
  state = close(state)
  state.src = src
  if (src === '') {
    return
  }
  isLoading.value = true
  state.controller = new AbortController()
  // this should emit proper events
  const source = data.source(src, sym)

  source.addEventListener(
    'message',
    (e) => {
      message.value = (e as MessageEvent).data
      // if we got a message we are no longer erroneous
      error.value = undefined
      isLoading.value = false

      emit('change', message.value)
    },
    { signal: state.controller.signal },
  )

  source.addEventListener(
    'error',
    (e) => {
      error.value = (e as ErrorEvent).error as Error
      isLoading.value = false

      emit('error', error.value)
    },
    { signal: state.controller.signal },
  )
}
const close = (state: State) => {
  if (typeof state.controller !== 'undefined') {
    state.controller.abort()
  }
  if (typeof state.src !== 'undefined') {
    data.close(state.src, sym)
  }
  return {}
}
watch(() => [props.src, props.shouldMakeRequest] as const, function ([src]) {
  if (props.shouldMakeRequest) {
    open(src)
  }
}, { immediate: true })
onBeforeUnmount(() => {
  state = close(state)
})
const refresh = () => {
  open(props.src)
}
</script>
