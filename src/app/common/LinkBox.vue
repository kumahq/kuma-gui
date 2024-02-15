<template>
  <div class="link-box">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.link-box {
  display: flex;
  align-items: center;
}

.link-box :deep(> *) {
  border-color: $kui-color-border-primary-weak;
  border-top: $kui-border-width-10 solid;
  border-bottom: $kui-border-width-10 solid;
  padding: $kui-space-30 $kui-space-50;
  font-weight: $kui-font-weight-semibold;
}

.link-box :deep(> .active) {
  border-color: $kui-color-border-primary-strong;
  background-color: $kui-color-background-primary-weakest;
}

.link-box :deep(> * + *) {
  border-left: $kui-border-width-10 solid;
}

.link-box :deep(> *:first-child) {
  border-left: $kui-border-width-10 solid;
  border-top-left-radius: $kui-border-radius-30;
  border-bottom-left-radius: $kui-border-radius-30;
}

.link-box :deep(> *:last-child) {
  border-right: $kui-border-width-10 solid;
  border-top-right-radius: $kui-border-radius-30;
  border-bottom-right-radius: $kui-border-radius-30;
}
</style>
