<template>
  <div class="status flex items-center justify-center">
    <span
      class="status__dot"
      :class="{ 'is-active': active }"
    />
    <div
      class="flex items-center"
      :title="content"
    >
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Status',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.status {
  font-size: var(--type-sm);
  color: var(--gray-3);
  letter-spacing: 0;
  line-height: 20px;
}

.status__dot {
  --status-color: var(--red-600);
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 100%;
  margin-right: 6px;
  background-color: var(--status-color);

  &.is-active {
    --status-color: var(--green-500);
  }
}
</style>
