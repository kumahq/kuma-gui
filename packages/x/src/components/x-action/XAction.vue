<template>
  <XRouter>
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
          to: _href(props.href || props.to),
        }"
        :danger="props.appearance === 'danger' ? true : false"
      >
        <slot name="default" />
      </KDropdownItem>
    </template>
    <template
      v-else-if="_href(props.href || props.to).length > 0"
    >
      <KButton
        v-if="['primary', 'secondary', 'tertiary', 'danger'].includes(props.appearance)"
        data-testid="x-action"
        v-bind="$attrs"
        :appearance="props.appearance as ButtonAppearance"
        :size="props.size"
        :to="_href(props.href || props.to)"
        :target="target"
        :rel="rel"
      >
        <template
          v-if="['create', 'refresh', 'progress'].includes(props.action)"
        >
          <XIcon
            :name="props.action as ('create' | 'refresh' | 'progress')"
          />
        </template>
        <slot
          name="default"
        />
        <template
          v-if="['expand'].includes(props.action)"
        >
          <XIcon
            :name="props.action as 'expand'"
          />
        </template>
      </KButton>

      <a
        v-else
        data-testid="x-action"
        v-bind="$attrs"
        :href="_href(props.href || props.to)"
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
  </XRouter>
</template>
<script lang="ts" setup>
import { KDropdownItem, KButton } from '@kong/kongponents'
import { computed, inject, provide, useAttrs } from 'vue'


import { useHref } from '../../'
import type { ButtonAppearance } from '@kong/kongponents'

type HrefTo = Exclude<Parameters<ReturnType<typeof useHref>>[0], string>

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
  to?: HrefTo
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
const _href = useHref()

const group = inject<{
  expanded: boolean
} | undefined>('x-action-group', undefined)



const isExternal = (url: string) => {
  try {
    return new URL(url, window.location.href).origin !== window.location.origin
  } catch {
    return false
  }
}
const target = computed(() => isExternal(_href(props.href || props.to)) ? '_blank' : undefined)
const rel = computed(() => target.value === '_blank' ? 'noopener noreferrer' : undefined)

if(_href(props.href || props.to).length > 0 || typeof attrs.onClick === 'function' || props.for || Object.keys(props.to).length) {
  provide('x-action', {})
}
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
