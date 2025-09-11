<template>
  <KBadge
    :max-width="props.maxWidth"
    :icon-before="false"
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
import { inject } from 'vue'
const props = withDefaults(defineProps<{
  maxWidth?: string
}>(), {
  maxWidth: 'auto',
})
const xAction = inject<{} | undefined>('x-action', undefined)
</script>
