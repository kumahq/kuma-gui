<template>
  <template
    v-if="Object.keys(props.to).length > 0"
  >
    <RouterLink
      :to="{
        ...props.to,
        query,
      }"
    >
      <slot name="default" />
    </RouterLink>
  </template>
  <template
    v-else-if="props.href.length > 0"
  >
    <a
      :href="props.href"
      target="_blank"
      rel="noopener noreferrer"
    >
      <slot name="default" />
    </a>
  </template>
  <template
    v-else-if="props.for.length > 0"
  >
    <label :for="props.for">
      <slot name="default" />
    </label>
  </template>
  <template
    v-else
  >
    <button type="button">
      <slot name="default" />
    </button>
  </template>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import type { RouteLocationNamedRaw } from 'vue-router'
type BooleanLocationQueryValue = string | number | undefined | boolean
type BooleanLocationQueryRaw = Record<string | number, BooleanLocationQueryValue | BooleanLocationQueryValue[]>
type RouteLocationRawWithBooleanQuery = Omit<RouteLocationNamedRaw, 'query'> & {
  query?: BooleanLocationQueryRaw
}

const props = withDefaults(defineProps<{
  href?: string
  to?: RouteLocationRawWithBooleanQuery
  for?: string
}>(), {
  href: '',
  to: () => ({}),
  for: '',
})
const query = computed(() => {
  return Object.entries(props.to.query ?? {}).reduce<Record<string, string | number | null | undefined>>((prev, [key, value]) => {
    switch (true) {
      case value === true:
        prev[key] = null
        break
      case value === false:
        prev[key] = undefined
        break
      default:
        prev[key] = value as string | number | undefined
    }
    return prev
  }, {})
})
</script>
