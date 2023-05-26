<template>
  <div class="app-title-bar">
    <div class="title-wrapper">
      <KIcon icon="kong" />

      <span class="title">
        <slot name="title" />
      </span>
    </div>

    <div class="action-list">
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { KIcon } from '@kong/kongponents'
</script>

<style lang="scss" scoped>
.app-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--grey-300);
  background-color: var(--white);
}

.title-wrapper {
  display: inline-flex;
  align-items: center;
}

.title {
  margin-left: var(--spacing-xs);
  padding-left: var(--spacing-xs);
  border-left: 1px solid var(--grey-300);
  font-weight: var(--font-weight-semi-bold);
  font-size: 20px;
}

.action-list {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}
</style>
