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
.app-navigator::before {
  content: none;
}
:deep(a) {
  &::before {
    content: '';
    animation-name: var(--icon-name-start), icon-size-40;
    margin-right: $kui-space-40;
  }
}
</style>
