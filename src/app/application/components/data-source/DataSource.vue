<template>
  <slot
    :data="(message as any)"
    :error="error"
    :refresh="refresh"
  />

  <span />
</template>

<script lang="ts" setup>
import { watch, ref, onBeforeUnmount } from 'vue'

import { useDataSourcePool } from '@/app/application'

const data = useDataSourcePool()

const props = defineProps<{
  src: string
}>()

const message = ref<unknown>(undefined)
const error = ref<Error | undefined>(undefined)

const emit = defineEmits<{
  (e: 'change', value: any): void
  (e: 'error', error: Error): void
}>()

const sym = Symbol('')

type DataSource = ReturnType<typeof data.source>

type Close = () => void;

let source: DataSource | undefined
let controller = new AbortController()
let close: Close = () => {}

const open = (src: string): Close => {
  // abort anything previous and reset the AbortController
  // if open if called imediately after a close.
  // this could be the controllers second call if it was closed first
  if (!controller.signal.aborted) {
    controller.abort()
  }
  controller = new AbortController()
  // if src is empty then we have no source and close does nothing
  if (src === '') {
    source = undefined
    return () => {}
  }

  // get a possibly shared instance of a Source
  source = data.source(src, sym)

  // add events that will be aborted by the above controler
  source.addEventListener(
    'message',
    (e) => {
      message.value = (e as MessageEvent).data
      // if we got a message we are no longer erroneous
      error.value = undefined
      // this should emit proper events
      emit('change', message.value)
    },
    { signal: controller.signal },
  )
  source.addEventListener(
    'error',
    (e) => {
      error.value = (e as ErrorEvent).error as Error
      // this should emit proper events
      emit('error', error.value)
    },
    { signal: controller.signal },
  )

  // close
  return () => {
    // abort anything
    controller.abort()
    // clear out data
    message.value = undefined
    // unregister from a possibly shared instance of a Source (i.e. close)
    data.close(src, sym)
  }
}
// refresh doesn't need to 'hard close' the Source only reopen (i.e.
// re-request) the shared instance if it has responded already if it is still
// in transit this is essentially a noop
const refresh = () => {
  close = open(props.src)
}

// a change of src="" performs a full 'hard close' and acquiring of a new Source
// close is updated to close this new Source
watch(() => props.src, function (src) {
  close()
  close = open(src)
}, { immediate: true })

// close everything
onBeforeUnmount(() => {
  close()
})
</script>
<style lang="scss" scoped>
// 'visually-hidden type' rule applied here so we are dependency free
span {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}
</style>
