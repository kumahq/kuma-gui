<template>
  <GlobalEvents
    target="window"
    v-bind="{
      ...(props.resize ? { onResize: (e: WindowEvent) => resizeRef = e} : {}),
    }"
  />
  <slot
    name="default"
    :resize="resizeRef"
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { GlobalEvents } from 'vue-global-events'

type WindowEvent = Event & {
  target?: Window
}

defineSlots<{
  default(props: {
    resize: WindowEvent
  }): any
}>()

const props = withDefaults(defineProps<{
  resize?: boolean
}>(), {
  resize: false,
})
const resizeRef = ref<WindowEvent>(new Event('resize') as WindowEvent)
window.dispatchEvent(resizeRef.value)
</script>
