<template>
  <template
    v-if="typeof provider !== 'undefined'"
  >
    <template
      v-if="slots.default"
    >
      <XTeleportTemplate
        v-if="props.notify"
        :to="{ name: `${provider.uri}-${props.uri}` }"
      >
        <slot name="default" />
      </XTeleportTemplate>
    </template>
    <XTeleportSlot
      v-else
      :name="`${provider.uri}-${props.uri}`"
    />
  </template>
</template>
<script lang="ts" setup>
import { inject, onBeforeUnmount, onMounted, watch } from 'vue'

import type { AlertAppearance } from '@kong/kongponents'
const provider = inject<{
  set(uri: string, obj: { variant: AlertAppearance } ): void
  delete(uri: string): void
  reset(uri: string): void
  uri: string
}>('x-notification-hub')

const props = withDefaults(defineProps<{
  uri: string
  variant?: AlertAppearance
  notify?: boolean
}>(), {
  variant: 'warning',
  notify: false,
})

const slots = defineSlots()
watch(() => {
  return !!(props.notify && slots.default)
}, (bool) => {
  if(typeof provider !== 'undefined') {
    if(bool) {
      provider.set(props.uri, props)
    } else {
      provider.reset(props.uri)
    }
  }
})
if(slots.default) {
  onMounted(() => {
    if(typeof provider !== 'undefined') {
      if(props.notify) {
        provider.set(props.uri, props)
      } else {
        provider.reset(props.uri)
      }
    }
  })
}
onBeforeUnmount(() => {
  if(typeof provider !== 'undefined') {
    provider.delete(props.uri)
  }
})
</script>
