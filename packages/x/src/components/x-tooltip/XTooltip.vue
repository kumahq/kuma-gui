<template>
  <KTooltip
    max-width="400"
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
  </KTooltip>
</template>
<script lang="ts" setup>
import { KTooltip } from '@kong/kongponents'

const slots = defineSlots()
</script>

