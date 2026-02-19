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
.in-x-action {
  & {
    cursor: pointer;
    border: 0;
    box-shadow: var(--x-shadow-border);
    transition: box-shadow var(--x-animation-duration-20) ease-in-out, background-color var(--x-animation-duration-20) ease-in-out;
  }
  &:hover {
    box-shadow: var(--x-shadow-border-primary-weak);
  }
  &:active {
    box-shadow: var(--x-shadow-border-primary-strongest);
  }

  &:focus-visible {
    box-shadow: var(--x-shadow-border-primary-weak), var(--x-shadow-focus);
  }
}
</style>
