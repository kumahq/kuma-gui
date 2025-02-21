<template>
  <template
    v-if="typeof provider !== 'undefined'"
  >
    <XTeleportTemplate
      v-if="slots.default"
      :to="{ name: `${provider.uri}-${props.uri}` }"
    >
      <slot name="default" />
    </XTeleportTemplate>
    <XTeleportSlot
      v-else
      :name="`${provider.uri}-${props.uri}`"
    />
  </template>
</template>
<script lang="ts" setup>
import { inject, onBeforeUnmount, onMounted } from 'vue'

import type { AlertAppearance } from '@kong/kongponents'
const provider = inject<{
  set(uri: string, obj: { variant: AlertAppearance } ): void
  delete(uri: string): void
  uri: string
}>('x-notification-hub')

const props = withDefaults(defineProps<{
  uri: string
  variant?: AlertAppearance
}>(), {
  variant: 'warning',
})

const slots = defineSlots()
if(slots.default) {
  onMounted(() => {
    if(typeof provider !== 'undefined') {
      provider.set(props.uri, props)
    }
  })
  onBeforeUnmount(() => {
    if(typeof provider !== 'undefined') {
      provider.delete(props.uri)
    }
  })
}
</script>
