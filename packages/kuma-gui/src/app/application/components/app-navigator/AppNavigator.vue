<template>
  <li
    class="app-navigator"
  >
    <slot name="default">
      <XAction
        :class="{
          'is-active': props.active,
        }"
        :to="props.to"
      >
        {{ props.label }}
      </XAction>
    </slot>
  </li>
</template>
<script lang="ts" setup>
const props = withDefaults(defineProps<{
  active?: boolean
  label?: string
  to?: {}
}>(), {
  active: false,
  label: '',
  to: () => ({}),
})
</script>

<style lang="scss" scoped>
:deep(a) {
  &::before {
    content: '';
    mask-image: var(--icon);
    background-color: currentColor;
    height: 20px;
    width: 20px;
    margin-right: $kui-space-40;
  }
}
</style>
