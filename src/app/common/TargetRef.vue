<template>
  <span class="target-ref">
    <RouterLink
      v-if="routeTarget !== null"
      :to="routeTarget"
    >
      <KBadge>
        <slot />
      </KBadge>
    </RouterLink>

    <KBadge v-else>
      <slot />
    </KBadge>

    <TagList
      v-if="props.targetRef.kind === 'MeshServiceSubset' && props.targetRef.tags"
      :tags="props.targetRef.tags"
    />

    <KTooltip
      v-if="props.targetRef.weight !== undefined && props.targetRef.weight !== 1"
      placement="right"
    >
      <InfoIcon
        :color="KUI_COLOR_BACKGROUND_NEUTRAL"
        :size="KUI_ICON_SIZE_30"
      />

      <template #content>
        weight: {{ props.targetRef.weight }}
      </template>
    </KTooltip>
  </span>
</template>

<script lang="ts" setup>
import { KUI_COLOR_BACKGROUND_NEUTRAL, KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { InfoIcon } from '@kong/icons'
import { computed } from 'vue'

import TagList from '@/app/common/TagList.vue'
import type { TargetRef } from '@/types/index.d'
import type { RouteLocationNamedRaw } from 'vue-router'

const props = defineProps<{
  targetRef: TargetRef
}>()

const routeTarget = computed<RouteLocationNamedRaw | null>(() => {
  if (!props.targetRef.name) {
    return null
  }

  switch (props.targetRef.kind) {
    case 'MeshService':
    case 'MeshServiceSubset': {
      return {
        name: 'service-detail-view',
        params: {
          service: props.targetRef.name,
        },
      }
    }
    case 'MeshGateway': {
      return {
        name: 'builtin-gateway-detail-view',
        params: {
          gateway: props.targetRef.name,
        },
      }
    }
    default: {
      throw new Error(`Unsupported targetRef ${props.targetRef.kind}.`)
    }
  }
})
</script>

<style lang="scss" scoped>
.target-ref {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $kui-space-40;
}
</style>
