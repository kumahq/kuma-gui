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

type ParametersExceptFirst<T> = T extends (_arg1: any, ...rest: infer R) => any ? R : never
type ParametersExceptFirstTwo<T> = T extends (_arg1: any, _arg2: any, ...rest: infer R) => any ? R : never

const t = (key: Parameters<typeof i18n['t']>[0], ...rest: ParametersExceptFirst<typeof i18n['t']>) => {
  return i18n.t(`${key.startsWith('.') ? props.prefix : ''}${key}`, ...rest)
}
const safeT = (
  key: Parameters<typeof i18n['t']>[0],
  params: Parameters<typeof i18n['t']>[1] = {},
  ...rest: ParametersExceptFirstTwo<typeof i18n['t']>
) => {
  // escape any param values, if the value isn't a string, empty it out we
  // aren't allowing nested icu params currently
  const escapedParams = Object.fromEntries(Object.entries(params).map(([key, value]) => [key, typeof value === 'string' ? escapeHtml(value) : '']))

  // we overwrite any params with safe hardcoded Teleport slots,
  // once `t` renders these we teleport the slot content into them
  // meaning the slot content is dealt with/escaped by Vue as normal
  const slotsOrParams = Object.keys(slots).reduce<typeof params>((prev, key) => {
    prev[key] = `<span data-x-teleport-id="${id}-${key}"></span>`
    return prev
  }, escapedParams)

  // make sure the prefix and key are also escaped
  return i18n.t(
    `${key.startsWith('.') && props.prefix.length > 0 ? `${escapeHtml(props.prefix)}` : ''}${escapeHtml(key)}`,
    slotsOrParams,
    ...rest,
  )
}

</script>
