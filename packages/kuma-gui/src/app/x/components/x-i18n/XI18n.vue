<template>
  <div
    v-html="_t(props.t, params)"
  />
  <template
    v-for="(_slot, key) in slots"
    :key="key"
  >
    <XTeleportTemplate
      :to="{ name: `x-i18n-${id}-${key}`}"
    >
      <slot
        :name="key"
      />
    </XTeleportTemplate>
  </template>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

import { useI18n, uniqueId } from '@/app/application'
const { t: _t } = useI18n()
const props = defineProps<{
  t: string
}>()
const slots = defineSlots()
const id = uniqueId('x-i18n')

const params = computed(() => {
  return Object.keys(slots).reduce<Record<string, string>>((prev, key) => {
    prev[key] = `<span data-x-teleport-id="x-i18n-${id}-${key}"></span>`
    return prev
  }, {})
})
</script>
