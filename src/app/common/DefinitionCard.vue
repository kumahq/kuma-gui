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
  gap: $kui-space-40;
}

.definition-card-title {
  display: flex;
  align-items: flex-end;
  gap: $kui-space-40;
}

.definition-card-container {
  flex-grow: 1;
  display: flex;
  align-items: flex-start;
  font-size: $kui-font-size-60;
  line-height: 1.5;
  font-weight: $kui-font-weight-bold;
}
</style>
