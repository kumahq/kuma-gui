<template>
  <span>
    Envoy (<strong>{{ payload.envoy }}</strong>) is unsupported by the current version of Kuma DP (<strong>{{ payload.kumaDp }}</strong>) [Requirements: <strong> {{ payload.requirements }}</strong>].
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
