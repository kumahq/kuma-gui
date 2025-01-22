<template>
  <KInputSwitch
    :model-value="props.checked"
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
  </KInputSwitch>
</template>

<script setup lang="ts">
import { KInputSwitch } from '@kong/kongponents'

const props = defineProps<{ checked?: boolean }>()
const slots = defineSlots()
</script>
