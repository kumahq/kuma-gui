<template>
  <div
    :class="['x-layout', props.type, props.size]"
  >
    <slot name="default" />
  </div>
</template>
<script lang="ts" setup>
const props = withDefaults(defineProps<{
  type?: 'stack' | 'separated' | 'columns'
  size?: 'small' | 'normal'
}>(), {
  type: 'stack',
  size: 'normal',
})
</script>
<style lang="scss" scoped>
.stack.normal > * + * {
  margin-block-start: $kui-space-70;
}
.stack.small > * + * {
  margin-block-start: $kui-space-40;
}
.separated {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $kui-space-40;
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
