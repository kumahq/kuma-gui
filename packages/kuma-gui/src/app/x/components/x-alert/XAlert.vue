<template>
  <KAlert
    :appearance="props.variant"
    :dismissible="typeof attrs.onDismiss === 'function'"
  >
    <template
      v-for="(_, key) in slots"
      :key="key"
      #[`${key}`]
    >
      <slot :name="key" />
    </template>
  </KAlert>
</template>
<script lang="ts" setup>
import { KAlert } from '@kong/kongponents'
import { useSlots, useAttrs } from 'vue'

import type { AlertAppearance } from '@kong/kongponents'

const slots = useSlots()
const attrs = useAttrs()

const props = withDefaults(defineProps<{
  variant?: AlertAppearance
}>(), {
  variant: 'warning',
})
</script>
<style lang="scss" scoped>
:deep(.k-button.primary) {
  color: $kui-color-text-inverse !important;
}
</style>
