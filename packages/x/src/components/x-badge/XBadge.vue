<template>
  <KBadge
    :max-width="props.maxWidth"
  >
    <slot name="default" />
    <XIcon
      v-if="xAction"
      name="link"
    />
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
<style scoped>
/* ideally we wouldn't use this, but its works to centralize the icon correctly */
/* feel free to change if you find something else*/
:deep(.x-icon-icon) {
  position: relative;
  top: -1px;
}
</style>
