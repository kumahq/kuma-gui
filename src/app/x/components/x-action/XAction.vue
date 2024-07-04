<template>
  <template
    v-if="Object.keys(props.to).length > 0"
  >
    <template
      v-if="group?.expanded === false"
    >
      <KDropdownItem
        v-bind="attrs"
        :item="{
          label: '',
          to: props.to,
        }"
      >
        <slot name="default" />
      </KDropdownItem>
    </template>
    <RouterLink
      v-else
      v-bind="attrs"
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
    <template
      v-if="group?.expanded === false"
    >
      <KDropdownItem
        v-bind="attrs"
        :item="{
          label: '',
          to: props.href,
        }"
      >
        <slot name="default" />
      </KDropdownItem>
    </template>
    <a
      v-else
      v-bind="attrs"
      :href="props.href"
      class="type-docs"
      target="_blank"
      :rel="props.type !== 'docs' ? `noopener noreferrer` : ``"
    >
      <template
        v-if="props.type === 'docs'"
      >
        <XIcon
          name="docs"
        />
        <slot
          name="default"
        />

      </template>
      <slot
        v-else
        name="default"
      />
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
    <template
      v-if="group?.expanded === false && !['primary', 'secondary', 'tertiary'].includes(props.appearance) && !['expand'].includes(props.type)"
    >
      <KDropdownItem
        v-bind="attrs"
        :danger="props.appearance === 'danger'"
        :item="{
          label: '',
          to: props.to,
        }"
        @click="emit('click')"
      >
        <slot name="default" />
      </KDropdownItem>
    </template>
    <KButton
      v-else-if="['primary', 'secondary', 'tertiary', 'danger'].includes(props.appearance)"
      v-bind="$attrs"
      :appearance="props.appearance as ButtonAppearance"
    >
      <slot name="default" />
      <template
        v-if="props.type === 'expand'"
      >
        <XIcon name="expand" />
      </template>
    </KButton>
    <button
      v-else
      v-bind="attrs"
      type="button"
      @click="emit('click')"
    >
      <slot name="default" />
    </button>
  </template>
</template>
<script lang="ts" setup>
import { KDropdownItem, ButtonAppearance } from '@kong/kongponents'
import { computed, watch, inject, useAttrs } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import type { RouteLocationNamedRaw } from 'vue-router'
type BooleanLocationQueryValue = string | number | undefined | boolean
type BooleanLocationQueryRaw = Record<string | number, BooleanLocationQueryValue | BooleanLocationQueryValue[]>
type RouteLocationRawWithBooleanQuery = Omit<RouteLocationNamedRaw, 'query'> & {
  query?: BooleanLocationQueryRaw
}

const emit = defineEmits<{
  (event: 'click'): Event
}>()
const props = withDefaults(defineProps<{
  type?: 'default' | 'docs' | 'create' | 'copy' | 'action' | 'more' | 'expand'
  appearance?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'anchor'
  href?: string
  to?: RouteLocationRawWithBooleanQuery
  for?: string
  mount?: (to: RouteLocationNamedRaw) => void
}>(), {
  href: '',
  appearance: 'anchor',
  type: 'default',
  to: () => ({}),
  for: '',
  mount: undefined,
})
const router = useRouter()
const attrs = {
  'data-testid': 'x-action',
  ...useAttrs(),
}

const group = inject<{
  expanded: boolean
}>('x-action-group')

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

watch(() => props.mount, (val) => {
  if (typeof val === 'function') {
    val({
      ...props.to,
      query: query.value,
    })
  }
}, { immediate: true })

watch(() => props.to, (val) => {
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
</script>
