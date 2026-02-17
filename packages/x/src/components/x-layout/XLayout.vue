<template>
  <component
    :is="(props.type === 'separated' || variant === 'separated') && props.truncate ? KTruncate : 'div'"
    :class="['x-layout', variant, props.size, justify]"
  >
    <slot name="default" />
  </component>
</template>
<script lang="ts" setup>
import { KTruncate } from '@kong/kongponents'
import { computed, inject } from 'vue'

import type { XTable } from '../'

type XComponent<T extends abstract new (...args: any) => any> = {
  props: InstanceType<T>['$props']
}

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
  // @ts-ignore because we need  to apply a runtime default depending on the variant
  justify: '',
  truncate: false,
})
const table = inject<XComponent<typeof XTable>>('x-table')
const variant = computed(() => props.variant.length > 0 ? props.variant : (props.type === 'stack' ? 'y-stack' : props.type))
// when inside a kv table default is `end`, otherwise its `start`
const justify = computed(() => table?.props.variant !== 'kv' ? props.justify || 'start' : props.justify || 'end')

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
