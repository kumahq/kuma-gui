<template>
  <template
    v-if="typeof provider !== 'undefined'"
  >
    <template
      v-if="slots.default"
    >
      <XTeleportTemplate
        v-if="shouldRender"
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
import { inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import type { XNotificationHubInjectable } from './XNotificationHub.vue'
import type { AlertAppearance } from '@kong/kongponents'

const provider = inject<XNotificationHubInjectable>('x-notification-hub')

const props = withDefaults(defineProps<{
  uri: string
  variant?: AlertAppearance
  notify?: boolean
}>(), {
  variant: 'warning',
  notify: false,
})

/**
 * `props.notify` is the default condition to render the notification.
 * Still we need to check if a notification uri is already registered in the hub, to prevent duplicates.
 * This ref is the source of truth to actually render the notification.
 */
const shouldRender = ref<boolean>(props.notify)

const slots = defineSlots()
watch(() => {
  return !!(props.notify && slots.default)
}, (bool) => {
  if(typeof provider !== 'undefined') {
    shouldRender.value = !provider.has(props.variant, props.uri) && props.notify
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
      shouldRender.value = !provider.has(props.variant, props.uri) && props.notify
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
