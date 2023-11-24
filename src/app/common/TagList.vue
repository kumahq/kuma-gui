<template>
  <component
    :is="shouldTruncate ? 'KTruncate' : 'div'"
    :width="shouldTruncate ? 'auto' : undefined"
    :class="{
      'tag-list': !shouldTruncate,
      'tag-list--align-right': props.alignment === 'right',
    }"
  >
    <KBadge
      v-for="(tag, index) in tagList"
      :key="index"
      max-width="auto"
      class="tag"
      :appearance="tag.isKuma ? 'default' : 'neutral'"
    >
      <component
        :is="tag.route ? 'RouterLink' : 'span'"
        :to="tag.route"
      >
        <template v-if="props.hideLabelKey">
          {{ tag.value }}
        </template>

        <template v-else>
          {{ tag.label }}:<b>{{ tag.value }}</b>
        </template>
      </component>
    </KBadge>
  </component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { LabelValue } from '@/types/index.d'
import { getLabels } from '@/utilities/getLabels'
import type { RouteLocationNamedRaw } from 'vue-router'

interface LabelValueWithRoute extends LabelValue {
  route: RouteLocationNamedRaw | undefined
  isKuma: boolean
}

const props = withDefaults(defineProps<{
  tags: LabelValue[] | Record<string, string> | null | undefined
  shouldTruncate?: boolean
  hideLabelKey?: boolean
  alignment?: 'left' | 'right'
}>(), {
  shouldTruncate: false,
  hideLabelKey: false,
  alignment: 'left',
})

const tagList = computed<LabelValueWithRoute[]>(() => {
  const labels = Array.isArray(props.tags) ? props.tags : getLabels(props.tags)

  return labels.map((tag) => {
    const { label, value } = tag
    const route = getRoute(tag)
    const isKuma = label.includes('.kuma.io/') || label.startsWith('kuma.io/')

    return { label, value, route, isKuma }
  })
})
const shouldTruncate = computed(() => props.shouldTruncate || Object.keys(tagList.value).length > 10)

function getRoute(tag: LabelValue): RouteLocationNamedRaw | undefined {
  // Wildcard tag values don’t refer to specific entities we can link to.
  if (tag.value === '*') {
    return undefined
  }

  try {
    switch (tag.label) {
      case 'kuma.io/zone': {
        return {
          name: 'zone-cp-detail-view',
          params: {
            zone: tag.value,
          },
        }
      }
      case 'kuma.io/service': {
        return {
          name: 'service-detail-view',
          params: {
            service: tag.value,
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
  } catch {
    // Ignores `router.resolve` errors because we don’t want this
    return undefined
  }
}
</script>

<style lang="scss" scoped>
.tag-list {
  display: inline-flex;
  flex-wrap: wrap;
  gap: $kui-space-40;
}

.tag-list--align-right,
.tag-list--align-right :deep(.k-truncate-container) {
  justify-content: flex-end;
}

.tag :deep(a) {
  color: currentColor;
}
</style>
