<template>
  <span>
    There is mismatch between versions of Zone Control Plane (<strong>{{ payload.zoneCpVersion }}</strong>) and the Global Control Plane (<strong>{{ payload.globalCpVersion }}</strong>)
  </span>
</template>

<script lang="ts" setup>
defineProps({
  payload: {
    type: Object,
    required: true,
  },
})
</script>
