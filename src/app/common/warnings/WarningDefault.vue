<template>
  <span>
    {{ payload }}
  </span>
</template>

<script lang="ts" setup>
defineProps({
  payload: {
    type: [String, Object],
    required: true,
  },
})
</script>
