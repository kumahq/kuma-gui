<template>
  <KTruncate width="auto">
    <KBadge
      v-for="(tag, index) in tagList"
      :key="index"
      class="tag-badge"
      max-width="auto"
    >
      <component
        :is="tag.route ? 'RouterLink' : 'span'"
        :to="tag.route"
      >
        {{ tag.label }}:<b>{{ tag.value }}</b>
      </component>
    </KBadge>
  </KTruncate>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { LabelValue } from '@/types/index.d'
import { getLabels } from '@/utilities/getLabels'
import type { RouteLocationNamedRaw } from 'vue-router'

interface LabelValueWithRoute extends LabelValue {
  route: RouteLocationNamedRaw | undefined
}

const props = defineProps<{
  tags: LabelValue[] | Record<string, string> | null | undefined
}>()

const tagList = computed<LabelValueWithRoute[]>(() => {
  const labels = Array.isArray(props.tags) ? props.tags : getLabels(props.tags)

  return labels.map((tag) => {
    const { label, value } = tag
    const route = getRoute(tag)

    return { label, value, route }
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
