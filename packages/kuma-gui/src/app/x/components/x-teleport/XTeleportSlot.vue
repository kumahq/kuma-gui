<template>
  <div
    :data-x-teleport-id="props.name"
  />
</template>
<script lang="ts" setup>
const props = defineProps<{
  name: string
}>()

</script>
