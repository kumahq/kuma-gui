<template>
  <template
    v-if="props.path.length > 0"
  >
    <!-- eslint-disable vue/no-v-html -->
    <div
      v-html="safeT(props.path, props.params)"
    />
    <!-- eslint-enable -->
    <template
      v-for="(_slot, slotName) in slots"
      :key="slotName"
    >
      <slot
        v-if="slotName === 'default'"
        :name="slotName"
        :t="t"
      />
      <XTeleportTemplate
        v-else
        :to="{ name: `${id}-${slotName}`}"
      >
        <slot
          :t="t"
          :name="slotName"
        />
      </XTeleportTemplate>
    </template>
  </template>
  <template
    v-else
  >
    <slot
      name="default"
      :t="t"
    />
  </template>
</template>
<script lang="ts" setup>
// eslint-disable-next-line vue/prefer-import-from-vue
import { escapeHtml } from '@vue/shared'
import { useSlots } from 'vue'

import { useI18n, uniqueId, useEnv } from '@/app/application'
import createI18n from '@/app/application/services/i18n/I18n'


const slots = useSlots()
const id = uniqueId('x-i18n')

const icuEscapeHtml = (str: string) => str.replace(/</g, "'<'")
  .replace(/%7B/g, '{')
  .replace(/%7D/g, '}')

const props = withDefaults(defineProps<{
  strings?: Record<string, string> | ((escape: typeof icuEscapeHtml) => Record<string, string>)
  prefix?: string
  path?: string
  params?: Record<string, string>
}>(), {
  strings: undefined,
  prefix: '',
  path: '',
  params: () => ({}),
})

const i18n = typeof props.strings !== 'undefined' ? createI18n(typeof props.strings === 'function' ? props.strings(icuEscapeHtml) : props.strings, useEnv()) : useI18n()

const t = (...rest: Parameters<typeof i18n['t']>) => {
  rest[0] = `${props.prefix}${rest[0]}`
  return i18n.t(...rest)
}
const safeT = (...rest: Parameters<typeof i18n['t']>) => {
  rest[0] =`${props.prefix.length > 0 ? `${escapeHtml(props.prefix)}` : ''}${escapeHtml(rest[0])}`
  if(typeof rest[1] !== 'undefined') {
    rest[1] = Object.fromEntries(Object.entries(props.params).map(([key, value]) => [key, typeof value === 'string' ? escapeHtml(value) : '']))
    // we overwrite any params with safe hardcoded Teleport slots,
    // once `t` renders these we teleport the slot content into them
    // meaning the slot content is dealt with/escaped by Vue as normal
    rest[1] = Object.keys(slots).reduce<NonNullable<typeof rest[1]>>((prev, key) => {
      prev[key] = `<span data-x-teleport-id="${id}-${key}"></span>`
      return prev
    }, rest[1])
  }
  return i18n.t(...rest)
}

</script>
