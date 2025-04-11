<template>
  <KBadge
    :appearance="props.appearance"
    :max-width="props.maxWidth"
  >
    <slot name="default" />
  </KBadge>
</template>

<script lang="ts" setup>
import { KBadge } from '@kong/kongponents'
const props = withDefaults(defineProps<{
  maxWidth?: string
  appearance?: InstanceType<typeof KBadge>['$props']['appearance']
}>(), {
  maxWidth: 'auto',
  appearance: undefined,
})
</script>
