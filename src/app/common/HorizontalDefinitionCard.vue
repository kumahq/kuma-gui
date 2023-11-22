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
  justify-content: space-between;
  align-items: baseline;
  gap: $kui-space-40;
}

.definition-card-title {
  display: flex;
  align-items: flex-end;
  gap: $kui-space-40;
}

.definition-card-container {
  display: flex;
  align-items: flex-start;
  font-weight: $kui-font-weight-bold;
}
</style>

<style lang="scss">
.definition-card-container > * {
  min-width: 0;
}
</style>
