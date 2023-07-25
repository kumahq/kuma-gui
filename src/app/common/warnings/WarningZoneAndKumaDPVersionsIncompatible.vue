<template>
  <span>
    There is a mismatch between versions of Kuma DP (<strong>{{ payload.kumaDp }}</strong>) and the Zone Control Plane.
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
