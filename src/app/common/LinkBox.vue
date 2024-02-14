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
  border-top: $kui-border-width-10 solid $kui-color-border;
  border-bottom: $kui-border-width-10 solid $kui-color-border;
  padding: $kui-space-40 $kui-space-60;
}

.link-box :deep(> * + *) {
  border-left: $kui-border-width-10 solid $kui-color-border;
}

.link-box :deep(> *:first-child) {
  border-left: $kui-border-width-10 solid $kui-color-border;
  border-top-left-radius: $kui-border-radius-20;
  border-bottom-left-radius: $kui-border-radius-20;
}

.link-box :deep(> *:last-child) {
  border-right: $kui-border-width-10 solid $kui-color-border;
  border-top-right-radius: $kui-border-radius-20;
  border-bottom-right-radius: $kui-border-radius-20;
}
</style>
