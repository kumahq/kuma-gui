<template>
  <dl
    :class="{
      [`variant-${props.variant}`]: true,
    }"
  >
    <slot name="default" />
  </dl>
</template>
<script lang="ts" setup>

const props = defineProps<{
  variant: 'x-stack'
}>()
</script>

<style lang="scss" scoped>
/* variants */
dl.variant-x-stack {
  &, :deep(div) {
    display: flex;
    align-items: baseline;
  }
  :deep(div) {
    gap: $kui-space-40;
  }
  & {
    flex-wrap: wrap;
    row-gap: $kui-space-30;
    column-gap: $kui-space-70;
  }
  :deep(dt) {
    gap: unset;
    &::after {
      content: ": ";
      display: inline;
    }
  }
}
</style>
