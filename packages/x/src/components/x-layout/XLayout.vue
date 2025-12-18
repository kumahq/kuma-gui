<template>
  <component
    :is="props.type === 'separated' && props.truncate ? KTruncate : 'div'"
    :class="['x-layout', variant, props.size, props.justify]"
  >
    <slot name="default" />
  </component>
</template>
<script lang="ts" setup>
import { KTruncate } from '@kong/kongponents'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  variant?: '' | 'x-stack' | 'y-stack' | 'separated' | 'columns'
  size?: 'small' | 'normal' | 'large' | 'max'
  justify?: 'start' | 'around' | 'between' | 'end'
  truncate?: boolean
  /** @deprecated please use `variant` */
  type?: 'stack' | 'separated' | 'columns'
}>(), {
  variant: '',
  type: 'stack',
  size: 'normal',
  justify: 'start',
  truncate: false,
})
const variant = computed(() => {
  return props.variant.length > 0 ? props.variant : (props.type === 'stack' ? 'y-stack' : props.type)
})
</script>
<style lang="scss" scoped>
.y-stack.large > * + * {
  margin-block-start: $kui-space-100;
}
.y-stack.normal > * + * {
  margin-block-start: $kui-space-70;
}
.y-stack.small > * + * {
  margin-block-start: $kui-space-40;
}
.x-stack {
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
}
.separated:not(.k-truncate) {
  display: inline-flex;
  width: 100%;
  align-items: center;
  flex-wrap: wrap;
}
:is(.x-stack, .separated:not(.k-truncate)) {
  &.small {
    gap: $kui-space-20;
  }
  &.normal {
    gap: $kui-space-40;
  }
  &.large {
    gap: $kui-space-80;
  }
  &.start {
    justify-content: flex-start;
  }
  &.max,
  &.between {
    justify-content: space-between;
  }
  &.around {
    justify-content: space-around;
  }
  &.end {
    justify-content: flex-end;
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
