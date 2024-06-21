<template>
  <div
    class="x-action-group"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.x-action-group {
  display: flex;
  align-items: center;
}

.x-action-group :deep(> *) {
  border-color: $kui-color-border-primary-weak;
  border-top: $kui-border-width-10 solid;
  border-bottom: $kui-border-width-10 solid;
  padding: $kui-space-30 $kui-space-50;
  font-weight: $kui-font-weight-semibold;
  text-decoration: none;
}

.x-action-group :deep(> .active) {
  border-color: $kui-color-border-primary-strong;
  background-color: $kui-color-background-primary-weakest;
}

.x-action-group :deep(> * + *) {
  border-left: $kui-border-width-10 solid;
}

.x-action-group :deep(> *:first-child) {
  border-left: $kui-border-width-10 solid;
  border-top-left-radius: $kui-border-radius-30;
  border-bottom-left-radius: $kui-border-radius-30;
}

.x-action-group :deep(> *:last-child) {
  border-right: $kui-border-width-10 solid;
  border-top-right-radius: $kui-border-radius-30;
  border-bottom-right-radius: $kui-border-radius-30;
}
</style>
