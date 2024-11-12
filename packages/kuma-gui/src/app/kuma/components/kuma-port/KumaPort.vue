<template>
  <XBadge
    appearance="info"
  >
    {{ props.port.port }}{{ props.port.targetPort ? `:${props.port.targetPort}` : '' }}{{ protocol ? `/${protocol}` : '' }}{{ props.port.name && props.port.name !== String(props.port.port) ? ` (${props.port.name})` : '' }}
  </XBadge>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
const props = defineProps<{
  port: {
    port: number
    targetPort?: number | string
    name?: string
    appProtocol?: string
    protocol?: string
  }
}>()
const protocol = computed(() => {
  return typeof props.port.appProtocol !== 'undefined' ? props.port.appProtocol : typeof props.port.protocol !== 'undefined' ? props.port.protocol : ''
})
</script>
