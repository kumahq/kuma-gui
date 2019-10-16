<template>
  <span
    class="pill rounded px-2 py-1"
    :style="{ backgroundColor: background, color: color }"
  >{{ label }}</span>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    background: {
      type: String,
      required: false
    },
    color: {
      type: String,
      required: false
    }
  }
};
</script>

<style>
</style>