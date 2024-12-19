<template>
  <KAlert
    :appearance="props.variant"
    :dismissible="props.dismissable"
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
import { useSlots } from 'vue'

import type { AlertAppearance } from '@kong/kongponents'

const slots = useSlots()

const props = withDefaults(defineProps<{
  variant?: AlertAppearance
  dismissable?: boolean
}>(), {
  variant: 'warning',
  dismissable: false,
})
</script>
<style lang="scss" scoped>
:deep(.k-button.primary) {
  color: $kui-color-text-inverse !important;
}
</style>
