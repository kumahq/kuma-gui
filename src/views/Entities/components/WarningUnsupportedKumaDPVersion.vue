<template>
  <span>
    Unsupported version of Kuma DP (<strong>{{ payload.kumaDp }}</strong>)
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
