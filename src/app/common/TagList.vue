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
import { RouteLocation, useRoute, useRouter } from 'vue-router'

import { LabelValue } from '@/types/index.d'
import { getLabels } from '@/utilities/getLabels'

const route = useRoute()
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
          name: 'zone-cp-detail-view',
          params: {
            zone: tag.value,
          },
        })
      }
      case 'kuma.io/service': {
        // Annotations by themselves don’t have information about a service’s associated mesh. The easiest solution is to read this information from the current route. A better approach could be to provide the current mesh as an optional prop to `TagList`.
        // TODO: Consider adding an optional `props.mesh` to this component and provide it whenever passing tags from a mesh resource. That would make this unambiguous.
        if (!('mesh' in route.params)) {
          return undefined
        }

        return router.resolve({
          name: 'service-detail-view',
          params: {
            mesh: route.params.mesh,
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
  gap: $kui-space-20;
}

.tag-badge a {
  text-decoration: none;
}
</style>
