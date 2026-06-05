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
  variant?: 'reserved-kv' | 'kv' | 'default'
  appearance?: BadgeAppearance | string
}>(), {
  maxWidth: 'auto',
  variant: 'default',
  appearance: undefined,
})
const xAction = inject<{} | undefined>('x-action', undefined)
const appearance = computed<BadgeAppearance>(() => {
  switch(props.variant) {
    case 'kv':
      return 'neutral' as BadgeAppearance
    case 'reserved-kv':
      return 'info' as BadgeAppearance
    default:
      return props.appearance as BadgeAppearance
  }
})
</script>
<style lang="scss" scoped>
.variant-kv, .variant-reserved-kv {
  &.k-badge {
    font-weight: var(--x-font-weight-regular);
  }
  :slotted(strong) {
    font-weight: var(--x-font-weight-semibold);
  }
}
</style>
