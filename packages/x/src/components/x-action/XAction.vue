<template>
  <template
    v-if="group?.expanded === false"
  >
    <KDropdownItem
      data-testid="x-action"
      v-bind="$attrs"
      :target="target"
      :rel="rel"
      :item="{
        label: '',
        to: href.length > 0 ? href : {
          ...props.to,
          query,
        },
      }"
      :danger="props.appearance === 'danger' ? true : false"
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
    v-else-if="href.length > 0"
  >
    <KButton
      v-if="['primary', 'secondary', 'tertiary', 'danger'].includes(props.appearance)"
      data-testid="x-action"
      v-bind="$attrs"
      :appearance="props.appearance as ButtonAppearance"
      :size="props.size"
      :to="href"
      :target="target"
      :rel="rel"
    >
      <slot
        name="default"
      />
    </KButton>

    <a
      v-else
      data-testid="x-action"
      v-bind="$attrs"
      :href="href"
      :class="{
        'x-action-appearance-anchor': true,
        'action-docs': props.action === 'docs',
      }"
      :target="target"
      :rel="rel"
    >
      <template
        v-if="props.action === 'docs'"
      >
        <XIcon
          name="docs"
          :size="`var(--x-icon-size-40)`"
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
      v-else-if="typeof attrs.onClick === 'function'"
      :class="`x-action-appearance-${props.appearance}`"
      data-testid="x-action"
      v-bind="$attrs"
    >
      <template
        v-if="['docs'].includes(props.action)"
      >
        <XIcon
          name="docs"
          :size="`var(--x-icon-size-40)`"
        />
      </template>
      <span><slot name="default" /></span>
    </button>
    <template
      v-else
    >
      <slot
        name="default"
        :inactive="true"
      />
    </template>
  </template>
</template>
<script lang="ts">
// eslint-disable-next-line import/order
import SharedPool from '../../utilities/SharedPool'
// eslint-disable-next-line import/order
import type { Router, RouteLocationAsRelative } from 'vue-router'

const findAnchor = (target: HTMLElement) => {
  // we look for anchors, or any other element that has [data-actionable]
  const $el = target.tagName.toLowerCase() === 'a' ? target : target.closest('a,[data-actionable]')
  if($el) {
    switch(true) {
      // if its a data-action element we "bubble down" to find a child [data-action]
      case $el.hasAttribute('data-actionable'):
        return $el.querySelector('[data-action]')
      // otherwise we check for rel="x-internal"
      // which allows us to use vue-router links in our i18n locales files via
      // <a href="http-link" rel="x-internal" />
      // and helps us support custom protocols
      case ($el.getAttribute('rel') ?? '').includes('x-internal'):
        return $el
    }
  }
  // anything else we do nothing special
  return null
}
const createListener = (router: Router) => {
  return (e: Event) => {
    // if its not a user generated event return
    // if we ever need this listener to also fire on non-user generated events
    // we'll have to refine findAnchor and remove this
    if(!e.isTrusted) {
      return
    }
    const $a = findAnchor(e.target as HTMLElement)
    if($a) {
      // anything with x-internal is something for whatever reason we can't/don't want to use RouterLink
      if (($a.getAttribute('rel') ?? '').includes('x-internal')) {
        const href = $a.getAttribute('href')
        if(href) {
          e.preventDefault()
          e.stopPropagation()
          const base = router.options.history.base
          router.push(href.startsWith(base) ? href.substring(base.length) : href)
        }
      // anything else
      } else if('click' in $a && typeof $a.click === 'function') {
        $a.click()
      }
    }

  }
}
const pool = new SharedPool<Router, (e: Event) => void>((state, router, item) => {
  switch (state) {
    case 'creating': {
      const listener = createListener(router)
      document.body.addEventListener('click', listener)
      return listener
    }
    case 'acquiring':
      return item
    case 'releasing':
      return item
    case 'destroying':
      document.body.removeEventListener('click', item)
      return item
  }
})
</script>
<script lang="ts" setup>
import { KDropdownItem, KButton } from '@kong/kongponents'
import { computed, watch, inject, provide, useAttrs, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { useProtocolHandler } from '../../'
import type { ButtonAppearance } from '@kong/kongponents'

type BooleanLocationQueryValue = string | number | undefined | boolean
type BooleanLocationQueryRaw = Record<string | number, BooleanLocationQueryValue | BooleanLocationQueryValue[]>
type RouteLocationRawWithBooleanQuery = Omit<RouteLocationAsRelative, 'query'> & {
  query?: BooleanLocationQueryRaw
}

defineSlots<{
  default(props: {
    inactive?: boolean
  }): any
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

const attrs = useAttrs()

const group = inject<{
  expanded: boolean
} | undefined>('x-action-group', undefined)

const router = useRouter()

const sym = Symbol('protocolHandler')
onMounted(() => pool.acquire(router, sym))
onBeforeUnmount(() => pool.release(router, sym))

const protocolHandler = useProtocolHandler()
const href = computed(() => props.href.includes('://') ? protocolHandler(props.href) : props.href)
const target = computed(() => props.href.length > 0 && props.href === href.value ? '_blank' : undefined)
const rel = computed(() => target.value === '_blank' ? 'noopener noreferrer' : href.value.length > 0 && props.href === href.value ? undefined : 'x-internal')

if(href.value.length > 0 || typeof attrs.onClick === 'function' || props.for || Object.keys(props.to).length) {
  provide('x-action', {})
}

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
  color: var(--x-anchor-text-color);
}

button.x-action-appearance-anchor:hover span,
button.x-action-appearance-anchor:focus span {
  text-decoration: underline
}
.action-docs {
  display: flex;
  align-items: center;
  gap: var(--x-space-20);
}

</style>
