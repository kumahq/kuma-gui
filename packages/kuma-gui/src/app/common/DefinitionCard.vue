<template>
  <div
    class="definition-card"
    :class="{
      [`definition-card--${props.layout}`]: true,
    }"
  >
    <div
      v-if="slots.icon || slots.title"
      class="definition-card-title"
    >
      <slot name="icon" />

      <slot name="title" />
    </div>

    <div class="definition-card-container">
      <slot name="body" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  layout?: 'horizontal' | 'vertical'
}>(), {
  layout: 'vertical',
})
const slots = defineSlots()
</script>

<style lang="scss" scoped>
.definition-card {
  display: flex;
  gap: $kui-space-40;
}

.definition-card--horizontal {
  justify-content: space-between;
  align-items: baseline;

  .definition-card-title {
    gap: unset;

    &::after {
      content: ": ";
      display: inline;
    }
  }
}

.definition-card--vertical {
  flex-direction: column;
}

.definition-card-title {
  display: flex;
  align-items: center;
  gap: $kui-space-40;
}

.definition-card-container {
  display: flex;
  align-items: flex-start;
  font-weight: $kui-font-weight-bold;
}

.definition-card--vertical .definition-card-container {
  flex-grow: 1;
  font-size: $kui-font-size-60;
}
</style>

<style lang="scss">
.definition-card-container > * {
  min-width: 0;
}
</style>
