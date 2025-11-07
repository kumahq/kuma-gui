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
  & {
    flex-wrap: wrap;
    row-gap: $kui-space-30;
    column-gap: $kui-space-70;
  }
  :deep(dd:first-of-type) {
    display: flex;
    align-items: baseline;
    &::before {
      content: ":";
      margin-right: $kui-space-30;
    }
  }
}
</style>
