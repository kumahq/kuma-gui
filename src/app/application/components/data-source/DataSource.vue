<script setup lang="ts">

import { watch, ref, onBeforeUnmount } from 'vue'

import { useDataSource } from '@/utilities'

const data = useDataSource()

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

let controller: AbortController
let _src: string
const sym = Symbol('')
const open = async (src: string) => {
  close(controller, _src)
  _src = src
  controller = new AbortController()
  // this should emit proper events
  const source = data.source(src, sym)
  if (typeof source !== 'undefined') {
    source.addEventListener(
      'message',
      (e: Event) => {
        message.value = (e as MessageEvent).data
        emit('change', message.value)
      },
      { signal: controller.signal },
    )
    source.addEventListener(
      'error',
      (e: Event) => {
        error.value = (e as ErrorEvent).error as Error
        emit('error', error.value)
      },
      { signal: controller.signal },
    )
  }
}
const close = (controller: AbortController | undefined, src: string) => {
  if (typeof controller !== 'undefined') {
    controller.abort()
  }
  if (typeof src !== 'undefined') {
    data.close(src, sym)
  }
  controller = undefined
}
watch(() => props.src, (src) => open(src), { immediate: true })
onBeforeUnmount(() => {
  close(controller, _src)
})
const refresh = () => {
  close(controller, _src)
  open(props.src)
}
</script>

<template>
  <slot
    :data="message as any"
    :error="error"
    :refresh="refresh"
  />
  <data />
</template>
