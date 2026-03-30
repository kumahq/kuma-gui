<template>
  <KAlert
    :show-icon="props.icon"
    :appearance="props.variant"
    :dismissible="typeof attrs.onDismiss === 'function'"
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
  </KAlert>
</template>
<script lang="ts" setup>
import { KAlert } from '@kong/kongponents'
import { useAttrs } from 'vue'

import type { AlertAppearance } from '@kong/kongponents'

const props = withDefaults(defineProps<{
  variant?: AlertAppearance
  icon?: boolean
}>(), {
  variant: 'warning',
  icon: true,
})
const slots = defineSlots()

const attrs = useAttrs()
</script>
<style lang="scss" scoped>
:deep(.k-button.primary) {
  color: var(--x-color-text-inverse) !important;
}
:deep(.x-action-appearance-anchor),
:deep(a:not([class])) {
  text-decoration: underline !important;
}
</style>
