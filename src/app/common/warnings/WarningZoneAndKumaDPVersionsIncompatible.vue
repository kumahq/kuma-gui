<template>
  <span>
    There is a mismatch between versions of Kuma DP (<strong>{{ payload.kumaDp }}</strong>) and the Zone CP.
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
