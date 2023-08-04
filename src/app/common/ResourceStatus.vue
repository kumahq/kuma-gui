<template>
  <div class="resource-status">
    <div class="resource-status-title">
      <slot name="icon" />

      <slot name="title" />
    </div>

    <div class="resource-status-container">
      <span v-if="props.online !== null">{{ props.online }}</span><span
        v-if="props.online !== null"
        class="status-separator"
      >/</span><span class="status-total">{{ props.total }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  total: {
    type: Number,
    required: true,
  },

  online: {
    type: Number,
    default: null,
  },
})
</script>

<style lang="scss" scoped>
.resource-status>*+* {
  margin-top: var(--spacing-xs);
}

.resource-status-title {
  display: flex;
  align-items: flex-end;
  gap: var(--spacing-xs);
}

.resource-status-container {
  font-size: var(--type-xxxl);
  line-height: 1.5;
  font-weight: var(--font-weight-bold);
}

.status-separator,
.status-separator + .status-total {
  color: var(--black-200);
}
</style>
