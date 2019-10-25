<template>
  <div class="status">
    <span class="status__dot" :class="{ 'is-active': active }"></span>
    <span class="status__label">{{ content }}</span>
  </div>
</template>

<script>
export default {
  name: "Status",
  props: {
    content: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.status {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--type-sm);
  color: var(--gray-3);
  letter-spacing: 0;
  line-height: 20px;
}

.status__dot {
  --status-color: var(--red-base);
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 100%;
  margin-right: 6px;
  background-color: var(--status-color);
}

.status__dot.is-active {
  --status-color: var(--green-1);
}
</style>
