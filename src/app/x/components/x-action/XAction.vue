<template>
  <template
    v-if="Object.keys(props.to).length > 0"
  >
    <RouterLink
      v-if="Object.keys(to).length > 0"
      v-bind="attrs"
      :to="{
        ...to,
        query,
      }"
    >
      <slot name="default" />
    </RouterLink>
    <span
      v-else
      v-bind="attrs"
      class="error"
      title="Unable to render link"
    >
      <slot name="default" />
    </span>
  </template>
  <template
    v-else-if="props.href.length > 0"
  >
    <a
      v-bind="attrs"
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
    <label
      v-bind="attrs"
      :for="props.for"
    >
      <slot name="default" />
    </label>
  </template>
  <template
    v-else
  >
    <button
      type="button"
      v-bind="attrs"
    >
      <slot name="default" />
    </button>
  </template>
</template>
<script lang="ts" setup>
import { computed, watch, useAttrs } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import type { RouteLocationNamedRaw } from 'vue-router'
type BooleanLocationQueryValue = string | number | undefined | boolean
type BooleanLocationQueryRaw = Record<string | number, BooleanLocationQueryValue | BooleanLocationQueryValue[]>
type RouteLocationRawWithBooleanQuery = Omit<RouteLocationNamedRaw, 'query'> & {
  query?: BooleanLocationQueryRaw
}

defineOptions({
  inheritAttrs: false,
})
const attrs = useAttrs()

const router = useRouter()

const props = withDefaults(defineProps<{
  href?: string
  to?: RouteLocationRawWithBooleanQuery
  for?: string
  mount?: (to: RouteLocationNamedRaw) => void
}>(), {
  href: '',
  to: () => ({}),
  for: '',
  mount: undefined,
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
const to = computed(() => {
  const to = props.to
  try {
    router.resolve({
      ...to,
      query: query.value,
    })
    return to
  } catch (e) {
    return {}
  }
})
watch(() => props.to, (val, old) => {
  if (JSON.stringify(val) === JSON.stringify(old)) {
    return
  }
  try {
    router.resolve({
      ...val,
      query: query.value,
    })
  } catch (e) {
    if (e instanceof Error) {
      e.message = `${e.toString()}: ${JSON.stringify(val)}`
    }
    console.error(e)
  }
}, { immediate: true })

watch(() => props.mount, (val) => {
  if (typeof val === 'function' && Object.keys(to).length > 0) {
    val({
      ...props.to,
      query: query.value,
    })
  }
}, { immediate: true })

</script>
<style lang="scss" scoped>
.error {
  text-decoration: underline dotted;
}
</style>
