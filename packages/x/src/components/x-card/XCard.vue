<template>
  <KCard
    :class="{ 'in-x-action': xAction }"
  >
    <template
      v-for="(_, slotName) in slots"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot
        :name="slotName"
        v-bind="(slotProps)"
      />
    </template>
  </KCard>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'
import { inject } from 'vue'

const slots = defineSlots()
const xAction = inject<{} | undefined>('x-action', undefined)
</script>
<style lang="scss" scoped>
/* copied from kong/kongponents KRadio::card=true */
$kongponentsTransitionDurTimingFunc: var(--kui-animation-duration-20, var(--x-animation-duration-20)) ease-in-out;
.in-x-action {
  & {
    cursor: pointer;
    border: 0;
    box-shadow: var(--kui-shadow-border, var(--x-shadow-border));
    transition: box-shadow $kongponentsTransitionDurTimingFunc, background-color $kongponentsTransitionDurTimingFunc;
  }
  &:hover {
    box-shadow: var(--kui-shadow-border-primary-weak, var(--x-shadow-border)-primary-weak);
  }
  &:active {
    box-shadow: var(--kui-shadow-border-primary-strongest, var(--x-shadow-border)-primary-strongest);
  }

  &:focus-visible {
    box-shadow: var(--kui-shadow-border-primary-weak, var(--x-shadow-border)-primary-weak), var(--kui-shadow-focus, var(--x-shadow-focus));
  }
}
</style>
