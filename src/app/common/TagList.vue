<template>
  <span class="tag-list">
    <KBadge
      v-for="(tag, index) in tagList"
      :key="index"
      class="tag-badge"
    >
      <component
        :is="tag.route ? 'router-link' : 'span'"
        :to="tag.route"
      >
        {{ tag.label }}:<b>{{ tag.value }}</b>
      </component>
    </KBadge>
  </span>
</template>

<script lang="ts" setup>
import { KBadge } from '@kong/kongponents'
import { computed, PropType } from 'vue'
import { RouteLocation, useRouter } from 'vue-router'

import { LabelValue } from '@/types/index.d'
import { getLabels } from '@/utilities/getLabels'

const router = useRouter()

interface LabelValueWithRoute extends LabelValue {
  route: RouteLocation | undefined
}

const props = defineProps({
  tags: {
    type: Object as PropType<LabelValue[] | Record<string, string> | null | undefined>,
    required: true,
  },
})

const tagList = computed<LabelValueWithRoute[]>(() => {
  const labels = Array.isArray(props.tags) ? props.tags : getLabels(props.tags)

  return labels.map((tag) => {
    const { label, value } = tag
    const route = getRoute(tag)

    return { label, value, route }
  })
})

function getRoute(tag: LabelValue): RouteLocation | undefined {
  // Wildcard tag values don’t refer to specific entities we can link to.
  if (tag.value === '*') {
    return undefined
  }

  try {
    switch (tag.label) {
      case 'kuma.io/zone': {
        return router.resolve({
          name: 'zones',
          query: { ns: tag.value },
        })
      }
      case 'kuma.io/service': {
        return router.resolve({
          name: 'service-detail-view',
          params: {
            service: tag.value,
          },
        })
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
  gap: var(--spacing-xxs);
}

.tag-badge a {
  text-decoration: none;
}
</style>
