<template>
  <component
    :is="props.shouldTruncate ? 'KTruncate' : 'div'"
    :width="props.shouldTruncate ? 'auto' : undefined"
    :class="{
      'tag-list': !props.shouldTruncate,
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
        {{ tag.label }}:<b>{{ tag.value }}</b>
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
}>(), {
  shouldTruncate: false,
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

.tag :deep(a) {
  color: currentColor;
}
</style>
