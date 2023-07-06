<script setup lang="ts">

import { watch, ref, onBeforeUnmount } from 'vue'

import { useDataSourcePool } from '@/utilities'

const data = useDataSourcePool()

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
})

const message = ref<unknown>(undefined)
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
  state = close(state)
  state.src = src
  if (src === '') {
    return
  }
  state.controller = new AbortController()
  // this should emit proper events
  const source = data.source(src, sym)
  source.addEventListener(
    'message',
    (e) => {
      message.value = e.data
      emit('change', message.value)
    },
    { signal: state.controller.signal },
  )
  source.addEventListener(
    'error',
    (e) => {
      error.value = (e as ErrorEvent).error as Error
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
watch(() => props.src, (src) => open(src), { immediate: true })
onBeforeUnmount(() => {
  state = close(state)
})
const refresh = () => {
  close(state)
  open(props.src)
}
</script>

<template>
  <slot
    :data="message as any"
    :error="error"
    :refresh="refresh"
  />
  <div />
</template>
