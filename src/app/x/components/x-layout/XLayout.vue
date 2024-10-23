<template>
  <div
    :class="['x-layout', props.type]"
  >
    <slot name="default" />
  </div>
</template>
<script lang="ts" setup>
const props = withDefaults(defineProps<{
  type?: 'stack' | 'separated'
}>(), {
  type: 'stack',
})
</script>
<style lang="scss" scoped>
.stack > * + * {
  margin-block-start: $kui-space-70;
}
.separated {
  display: inline-flex;
  flex-wrap: wrap;
  gap: $kui-space-40;
}
</style>
