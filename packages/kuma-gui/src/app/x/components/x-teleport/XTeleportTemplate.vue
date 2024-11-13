<template>
  <Teleport
    v-if="ready"
    :to="`[data-x-teleport-id='${props.to.name}']`"
  >
    <slot name="default" />
  </Teleport>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
const props = defineProps<{
  to: {
    name: string
  }
}>()

const ready = ref<boolean>(false)
onMounted(() => {
  if (document.querySelector(`[data-x-teleport-id='${props.to.name}']`) !== null) {
    ready.value = true
  } else {
    throw new Error(`The '[data-x-teleport-id='${props.to.name}']' element could not be found to teleport to`)
  }
})
</script>
