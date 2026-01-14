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

const props = withDefaults(defineProps<{
  variant?: 'x-stack' | 'y-stack'
}>(), {
  variant: 'x-stack',
})
</script>

<style lang="scss" scoped>
/* currently all variants are of the form `key: value` */
dl {
  :deep(> div) {
    display: flex;
    align-items: baseline;
    gap: $kui-space-30;
  }
  :has(dd) :deep(dt) {
    display: flex;
    align-items: baseline;
    &::after {
      content: ":";
    }
  }
}
/* variants */
dl.variant-x-stack {
  & {
    display: flex;
    align-items: baseline;
  }
  & {
    flex-wrap: wrap;
    row-gap: $kui-space-30;
    column-gap: $kui-space-70;
  }
}
</style>
