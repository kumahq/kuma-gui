<template>
  <span
    class="pill"
    :style="{ backgroundColor: background, color: color }"
  >{{ label }}</span>
</template>

<script>
export default {
  name: 'Pill',
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
}
</script>

<style scoped>
.pill {
  border-radius: 2px;
  padding: 0.1875rem 0.375rem;
  margin-right: 0.5rem;
}
</style>
