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
        v-if="['create', 'refresh', 'progress'].includes(props.action)"
      >
        <XIcon
          :name="props.action as ('create' | 'refresh' | 'progress')"
        />
      </template>
      <slot name="default" />
      <template
        v-if="['expand'].includes(props.action)"
      >
        <XIcon
          :name="props.action as 'expand'"
        />
      </template>
    </KButton>
    <RouterLink
      v-else
      :class="{
        'x-action-appearance-anchor': true,
      }"
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
    <KButton
      v-if="['primary', 'secondary', 'tertiary', 'danger'].includes(props.appearance)"
      data-testid="x-action"
      v-bind="$attrs"
      :appearance="props.appearance as ButtonAppearance"
      :size="props.size"
      :to="props.href"
      target="_blank"
    >
      <slot
        name="default"
      />
    </KButton>
    <a
      v-else
      data-testid="x-action"
      v-bind="$attrs"
      :href="props.href"
      :class="{
        'x-action-appearance-anchor': true,
        'action-docs': props.action === 'docs',
      }"
      target="_blank"
      :rel="props.action !== 'docs' ? `noopener noreferrer` : ``"
    >
      <template
        v-if="props.action === 'docs'"
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
        v-if="['create', 'refresh', 'progress'].includes(props.action)"
      >
        <XIcon
          :name="props.action as ('create' | 'refresh' | 'progress')"
        />
      </template>
      <slot name="default" />
      <template
        v-if="['expand'].includes(props.action)"
      >
        <XIcon
          :name="props.action as 'expand'"
        />
      </template>
    </KButton>

    <button
      v-else
      :class="`x-action-appearance-${props.appearance}`"
      data-testid="x-action"
      v-bind="$attrs"
      @click="emit('click')"
    >
      <template
        v-if="['docs'].includes(props.action)"
      >
        <XIcon
          name="docs"
          :size="KUI_ICON_SIZE_40"
        />
      </template>
      <span><slot name="default" /></span>
    </button>
  </template>
</template>
<script lang="ts" setup>
import { KUI_ICON_SIZE_40 } from '@kong/design-tokens'
import { KDropdownItem, KButton } from '@kong/kongponents'
import { computed, watch, inject } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import type { ButtonAppearance } from '@kong/kongponents'
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
  action?: 'default' | 'docs' | 'create' | 'copy' | 'action' | 'expand' | 'refresh' | 'progress'
  appearance?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'anchor'
  size?: 'small' | 'medium' | 'large'
  href?: string
  to?: RouteLocationRawWithBooleanQuery
  for?: string
}>(), {
  href: '',
  appearance: 'anchor',
  size: 'medium',
  action: 'default',
  to: () => ({}),
  for: '',
})

const group = inject<{
  expanded: boolean
} | undefined>('x-action-group', undefined)

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

</script>
<style lang="scss" scoped>
/* taken from styles/_base.scss `a` */
button.x-action-appearance-anchor,
button.x-action-appearance-anchor span {
  text-decoration: none;
  color: $kui-color-text-primary;
}

button.x-action-appearance-anchor:hover span,
button.x-action-appearance-anchor:focus span {
  text-decoration: underline
}
.action-docs {
  display: flex;
  align-items: center;
  gap: $kui-space-20;
}

</style>
