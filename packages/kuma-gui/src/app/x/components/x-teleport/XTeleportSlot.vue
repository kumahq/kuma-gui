<template>
  <div
    :data-x-teleport-id="props.name"
  />
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
const props = defineProps<{
  name: string
}>()
onMounted(() => {
  window.dispatchEvent(new CustomEvent<{ name: string }>('x-teleport-slot:mounted', { detail: { name: props.name } }))
})
</script>
