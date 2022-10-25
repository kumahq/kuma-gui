<template>
  <span>
    There is mismatch between versions of Zone CP (<strong>{{ payload.zoneCpVersion }}</strong>)
    and the Global CP (<strong>{{ payload.globalCpVersion }}</strong>)
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
