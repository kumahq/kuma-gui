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
import { computed, h, inject, onBeforeUnmount, onMounted, ref, render, watch } from 'vue'

import type { XNotificationHubInjectable } from './XNotificationHub.vue'
import type { AlertAppearance } from '@kong/kongponents'

const provider = inject<XNotificationHubInjectable>('x-notification-hub')

const props = withDefaults(defineProps<{
  uri: string
  variant?: AlertAppearance
  notify?: boolean
  type?: 'toast' | 'banner'
}>(), {
  variant: 'warning',
  notify: false,
  type: 'banner',
})
const slots = defineSlots()

const toastMessage = computed(() => {
  if(!slots.default || props.type !== 'toast') {
    return ''
  }
  const slotContent = slots.default()
  const tempDiv = document.createElement('div')
  render(h('div', {}, slotContent), tempDiv)
  const message = tempDiv.textContent || tempDiv.innerText || ''
  return message
})

/**
 * `props.notify` is the default condition to render the notification.
 * Still we need to check if a notification uri is already registered in the hub, to prevent duplicates.
 * This ref is the source of truth to actually render the notification.
 */
const shouldRender = ref<boolean>(props.notify)

watch(() => {
  return !!(props.notify && slots.default)
}, (bool) => {
  if(typeof provider !== 'undefined' && props.type === 'banner') {
    shouldRender.value = !provider.has(props.variant, props.uri) && props.notify
    if(bool) {
      provider.set(props.uri, props)
    } else {
      provider.reset(props.uri)
    }
  }
})

/**
 * Watch for toast notifications to open them via the provider's toaster.
 */
watch(() => {
  return provider && props.type === 'toast' && props.notify && toastMessage.value.length > 0
}, (shouldToast) => {
  if(!shouldToast || typeof provider === 'undefined') return

  provider.toaster.open({
    appearance: props.variant,
    message: toastMessage.value,
  })
}, { immediate: true })

if(slots.default) {
  onMounted(() => {
    if(typeof provider !== 'undefined' && props.type === 'banner') {
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
  if(typeof provider !== 'undefined' && props.type === 'banner') {
    provider.delete(props.uri)
  }
})
</script>
