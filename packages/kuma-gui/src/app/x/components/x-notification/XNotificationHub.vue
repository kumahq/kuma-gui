<template>
  <XProvider
    name="x-notification-hub"
    :service="hub"
  >
    <slot
      name="default"
      :notifications="notifications"
      :uri="`x-notification-hub-${props.uri}`"
    />
  </XProvider>
</template>
<script lang="ts" setup>
import { shallowRef, watch } from 'vue'

import type { AlertAppearance } from '@kong/kongponents'

const emit = defineEmits<{
  (event: 'reset', value: string): void
}>()

const props = withDefaults(defineProps<{
  uri: string
  dismissed?: string[]
}>(), {
  dismissed: () => [],
})
const notifications = shallowRef<Map<AlertAppearance, Set<string>>>(
  new Map(),
)

const del = (keys: string[]) => {
  if(keys.length === 0) {
    return
  }
  const n = new Map()
  notifications.value.forEach((value, variant) => {
    const diff = value.difference(new Set(keys))
    if(diff.size > 0) {
      n.set(variant, diff)
    }
  })
  notifications.value = n
}
const hub = {
  set: (str: string, { variant }: { variant: AlertAppearance } ) => {
    if(props.dismissed.includes(str)) {
      return
    }
    const s = notifications.value.has(variant) ? notifications.value.get(variant) : new Set<string>()
    notifications.value = new Map(notifications.value.set(variant, s!.add(str)).entries())
  },
  delete: (str: string) => {
    del([str])
  },
  reset: (str: string) => {
    del([str])
    emit('reset', str)
  },
  uri: `x-notification-hub-${props.uri}`,

}
watch(() => props.dismissed, () => {
  del(props.dismissed)
}, { immediate: true })

</script>
