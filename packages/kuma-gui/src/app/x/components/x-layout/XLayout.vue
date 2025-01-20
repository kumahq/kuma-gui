<template>
  <component
    :is="props.type === 'separated' && props.truncate ? KTruncate : 'div'"
    :class="['x-layout', props.type, props.size]"
  >
    <slot name="default" />
  </component>
</template>
<script lang="ts" setup>
import { KTruncate } from '@kong/kongponents'
const props = withDefaults(defineProps<{
  // TODO(jc) :variant
  type?: 'stack' | 'separated' | 'columns'
  size?: 'small' | 'normal' | 'max' | 'none'
  truncate?: boolean
}>(), {
  type: 'stack',
  size: 'normal',
  truncate: false,
})
</script>
<style lang="scss" scoped>
.stack.normal > * + * {
  margin-block-start: $kui-space-70;
}
.stack.small > * + * {
  margin-block-start: $kui-space-40;
}
.max {
  width: 100%;
}
.separated:not(.k-truncate) {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $kui-space-40;

  &.max {
    justify-content: space-between;
  }
}
.columns {
  --threshold: 40rem;

  display: flex;
  flex-wrap: wrap;
  gap: $kui-space-80;
}

.columns > * {
  flex-grow: 1;
  flex-basis: calc((var(--threshold) - 100%) * 999);
  min-inline-size: 0;
}

</style>
