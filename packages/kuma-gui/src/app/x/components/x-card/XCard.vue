<template>
  <KCard>
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

<script setup lang="ts">
import { KCard } from '@kong/kongponents'
const slots = defineSlots()
</script>

<style lang="scss" scoped>
:deep(p) {
  font-weight: $kui-font-weight-regular;
  font-size: $kui-font-size-30;
}
</style>
