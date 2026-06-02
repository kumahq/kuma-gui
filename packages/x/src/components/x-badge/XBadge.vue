<template>
  <KBadge
    :class="`variant-${props.variant}`"
    :max-width="props.maxWidth"
    :icon-before="false"
    :appearance="appearance"
  >
    <slot name="default" />
    <template #icon>
      <XIcon
        v-if="xAction"
        name="link"
      />
    </template>
  </KBadge>
</template>

<script lang="ts" setup>
import { KBadge } from '@kong/kongponents'
import { inject, computed } from 'vue'

import type { BadgeAppearance } from '@kong/kongponents'
const props = withDefaults(defineProps<{
  maxWidth?: string
  variant?: 'label' | 'kuma-label' | 'default'
  appearance?: BadgeAppearance | string
}>(), {
  maxWidth: 'auto',
  variant: 'default',
})
const xAction = inject<{} | undefined>('x-action', undefined)
const appearance = computed<BadgeAppearance>(() => {
  switch(props.variant) {
    case 'label':
      return 'neutral' as BadgeAppearance
    case 'kuma-label':
      return 'info' as BadgeAppearance
    default:
      return props.appearance as BadgeAppearance
  }
})
</script>
<style lang="scss" scoped>
.variant-label, .variant-kuma-label {
  &.k-badge {
    font-weight: var(--x-font-weight-regular);
  }
  :slotted(strong) {
    font-weight: var(--x-font-weight-semibold);
  }
}
</style>
