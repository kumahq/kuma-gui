<template>
  <slot name="default" />
</template>
<script lang="ts" setup>
import { provide } from 'vue'

const props = defineProps<{
  name: string
  service: object
}>()
provide(props.name, props.service)

</script>
