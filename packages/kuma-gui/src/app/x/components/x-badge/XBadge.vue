<template>
  <KBadge
    :max-width="props.maxWidth"
  >
    <slot
      name="default"
    />
  </KBadge>
</template>

<script lang="ts" setup>
import { KBadge } from '@kong/kongponents'
const props = withDefaults(defineProps<{
  maxWidth?: string
}>(), {
  maxWidth: 'auto',
})
</script>
