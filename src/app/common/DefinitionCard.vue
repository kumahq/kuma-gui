<template>
  <div class="definition-card">
    <div class="definition-card-title">
      <slot name="icon" />

      <slot name="title" />
    </div>

    <div class="definition-card-container">
      <slot name="body" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.definition-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.definition-card-title {
  display: flex;
  align-items: flex-end;
  gap: var(--spacing-xs);
}

.definition-card-container {
  flex-grow: 1;
  display: flex;
  align-items: center;
  font-size: var(--type-xxl);
  line-height: 1.5;
  font-weight: var(--font-weight-bold);
}
</style>
