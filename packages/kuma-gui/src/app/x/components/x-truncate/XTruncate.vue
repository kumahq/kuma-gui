<template>
  <KTruncate>
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
  </KTruncate>
</template>

<script setup lang="ts">
import { KTruncate } from '@kong/kongponents'
const slots = defineSlots()
</script>
