<template>
  <template
    v-if="group?.expanded === false"
  >
    <KDropdownItem
      data-testid="x-action"
      v-bind="$attrs"
      :target="props.href.length > 0 ? '_blank' : undefined"
      :item="{
        label: '',
        to: props.href.length > 0 ? props.href : {
          ...props.to,
          query,
        },
      }"
      :danger="props.appearance === 'danger' ? true : false"
      @click="emit('click')"
    >
      <slot name="default" />
    </KDropdownItem>
  </template>
  <template
    v-else-if="Object.keys(props.to).length > 0"
  >
    <KButton
      v-if="['primary', 'secondary', 'tertiary', 'danger'].includes(props.appearance)"
      data-testid="x-action"
      v-bind="$attrs"
      :appearance="props.appearance as ButtonAppearance"
      :size="props.size"
      :to="{
        ...props.to,
        query,
      }"
    >
      <template
        v-if="['create'].includes(props.type)"
      >
        <XIcon
          :name="props.type as 'create'"
        />
      </template>
      <slot name="default" />
      <template
        v-if="['expand'].includes(props.type)"
      >
        <XIcon
          :name="props.type as 'expand'"
        />
      </template>
    </KButton>
    <RouterLink
      v-else
      data-testid="x-action"
      v-bind="$attrs"
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
      data-testid="x-action"
      v-bind="$attrs"
      :href="props.href"
      :class="{
        'type-docs': props.type === 'docs',
      }"
      target="_blank"
      :rel="props.type !== 'docs' ? `noopener noreferrer` : ``"
    >
      <template
        v-if="props.type === 'docs'"
      >
        <XIcon
          name="docs"
          :size="KUI_ICON_SIZE_40"
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
      data-testid="x-action"
      v-bind="$attrs"
      :for="props.for"
    >
      <slot name="default" />
    </label>
  </template>
  <template
    v-else
  >
    <KButton
      v-if="['primary', 'secondary', 'tertiary', 'danger'].includes(props.appearance)"
      data-testid="x-action"
      v-bind="$attrs"
      :appearance="props.appearance as ButtonAppearance"
      :size="props.size"
      @click="emit('click')"
    >
      <template
        v-if="['create', 'refresh'].includes(props.type)"
      >
        <XIcon
          :name="props.type as ('create' | 'refresh')"
        />
      </template>
      <slot name="default" />
      <template
        v-if="['expand'].includes(props.type)"
      >
        <XIcon
          :name="props.type as 'expand'"
        />
      </template>
    </KButton>
    <button
      v-else
      :class="`appearance-${props.appearance}`"
      data-testid="x-action"
      v-bind="$attrs"
      type="button"
      @click="emit('click')"
    >
      <slot name="default" />
    </button>
  </template>
</template>
<script lang="ts" setup>
import { KUI_ICON_SIZE_40 } from '@kong/design-tokens'
import { KDropdownItem, ButtonAppearance } from '@kong/kongponents'
import { computed, watch, inject } from 'vue'
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
  type?: 'default' | 'docs' | 'create' | 'copy' | 'action' | 'expand' | 'refresh'
  appearance?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'anchor'
  size?: 'small' | 'medium' | 'large'
  href?: string
  to?: RouteLocationRawWithBooleanQuery
  for?: string
  mount?: (to: RouteLocationNamedRaw) => void
}>(), {
  href: '',
  appearance: 'anchor',
  size: 'medium',
  type: 'default',
  to: () => ({}),
  for: '',
})

const group = inject<{
  expanded: boolean
}>('x-action-group')

const router = useRouter()
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

watch(() => props.mount, (val) => {
  if (typeof val === 'function') {
    val({
      ...props.to,
      query: query.value,
    })
  }
}, { immediate: true })
</script>
<style lang="scss" scoped>
/* taken from styles/_base.scss `a` */
button.appearance-anchor {
  text-decoration: none;
  color: $kui-color-text-primary;
}

button.appearance-anchor:hover,
button.appearance-anchor:focus {
  text-decoration: underline
}
.type-docs {
  display: flex;
  align-items: center;
  gap: $kui-space-20;
}

</style>
