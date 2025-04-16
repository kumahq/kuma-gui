<template>
  <component
    :is="shouldTruncate ? 'KTruncate' : 'div'"
    :width="shouldTruncate ? 'auto' : undefined"
    :class="{
      'tag-list': !shouldTruncate,
      'tag-list--align-right': props.alignment === 'right',
    }"
  >
    <XBadge
      v-for="(tag, index) in tagList"
      :key="index"
      class="tag kv"
      :data-kv-key="tag.label"
      :data-kv-owner="tag.label.split('/')[0]"
    >
      <component
        :is="tag.route ? 'XAction' : 'span'"
        :to="tag.route"
      >
        <span class="label">{{ tag.label }}</span>:<span class="value">{{ tag.value }}</span>
      </component>
    </XBadge>
  </component>
</template>

<script lang="ts" setup>
/**
 * @deprecated Use XLayout (note `truncate` prop), XBadge and XTruncate instead
 */
import { computed } from 'vue'

import type { LabelValue, Tags } from '@/types/index.d'
import type { RouteLocationNamedRaw } from 'vue-router'

interface LabelValueWithRoute extends LabelValue {
  route: RouteLocationNamedRaw | undefined
}

const props = withDefaults(defineProps<{
  tags: LabelValue[] | Tags | null | undefined
  shouldTruncate?: boolean
  alignment?: 'left' | 'right'
}>(), {
  shouldTruncate: false,
  alignment: 'left',
})

const tagList = computed<LabelValueWithRoute[]>(() => {
  const labels = Array.isArray(props.tags) ? props.tags : Object.entries(props.tags ?? {}).map(([label, value]) => ({ label, value }))

  return labels.map((tag) => {
    const { label, value } = tag
    const route = getRoute(tag)

    return { label, value, route }
  })
})
const shouldTruncate = computed(() => props.shouldTruncate || Object.keys(tagList.value).length > 10)

function getRoute(tag: LabelValue): RouteLocationNamedRaw | undefined {
  // Wildcard tag values don’t refer to specific entities we can link to.
  if (tag.value === '*') {
    return undefined
  }

  switch (tag.label) {
    case 'kuma.io/zone': {
      return {
        name: 'data-plane-list-view',
        query: {
          s: `zone:${tag.value}`,
        },
      }
    }
    case 'kuma.io/service': {
      return {
        name: 'data-plane-list-view',
        query: {
          s: `service:${tag.value}`,
        },
      }
    }
    case 'kuma.io/mesh': {
      return {
        name: 'mesh-detail-view',
        params: {
          mesh: tag.value,
        },
      }
    }
    default: {
      return undefined
    }
  }
}
</script>
<style lang="scss" scoped>

.kv:not(:where(
  [data-kv-owner$='.kuma.io'],
  [data-kv-owner^='kuma.io']
)) {
  background-color: $kui-color-background-neutral-weaker !important;
  color: $kui-color-text-neutral-strong !important;
}

.tag-list {
  display: inline-flex;
  flex-wrap: wrap;
  gap: $kui-space-40;
}

.tag-list--align-right,
.tag-list--align-right :deep(.truncate-container) {
  justify-content: flex-end;
}

.tag :deep(a) {
  color: currentColor;
}
.tag :deep(a):hover {
  text-decoration: underline;
}
.tag :deep(span.label) {
  font-weight: $kui-font-weight-regular;
}
.tag :deep(span.value) {
  font-weight: $kui-font-weight-semibold;
}
</style>
