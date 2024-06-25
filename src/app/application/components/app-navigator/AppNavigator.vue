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
