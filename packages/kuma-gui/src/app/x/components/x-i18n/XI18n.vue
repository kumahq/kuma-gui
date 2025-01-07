<template>
  <div
    v-if="__t.length > 0"
    v-html="_t(__t, params)"
  />
  <template
    v-for="(_slot, key) in slots"
    :key="key"
  >
    <slot
      v-if="key === 'default'"
      :name="key"
      :t="_t"
    />
    <XTeleportTemplate
      v-else
      :to="{ name: `x-i18n-${id}-${key}`}"
    >
      <slot
        :t="_t"
        :name="key"
      />
    </XTeleportTemplate>
  </template>
</template>
<script lang="ts" setup>
import { useSlots, computed } from 'vue'

import { useI18n, uniqueId, useEnv } from '@/app/application'
import createI18n from '@/app/application/services/i18n/I18n'

const slots = useSlots()
const id = uniqueId('x-i18n')

const prefix = computed(() => props.prefix.length > 0 ? `${props.prefix.replaceAll('<', '&lt;').replaceAll('>', '&gt;')}.` : '')
const __t = computed(() => props.t.length > 0 ? `${props.t.replaceAll('<', '&lt;').replaceAll('>', '&gt;')}` : '')

const props = withDefaults(defineProps<{
  prefix?: string
  t?: string
  strings?: Record<string, string>
}>(), {
  prefix: '',
  t: '',
  strings: undefined,
})

const i18n = typeof props.strings !== 'undefined' ? createI18n(props.strings, useEnv()) : useI18n()

const _t = (...rest: Parameters<typeof i18n['t']>) => {
  rest[0] = `${prefix.value}${rest[0]}`
  return i18n.t(...rest)
}

const params = computed(() => {
  return Object.keys(slots).reduce<Record<string, string>>((prev, key) => {
    prev[key] = `<span data-x-teleport-id="x-i18n-${id}-${key}"></span>`
    return prev
  }, {})
})
</script>
