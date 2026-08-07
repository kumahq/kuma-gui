<template>
  <span class="target-ref">
    <XAction
      v-if="routeTarget !== null"
      :to="routeTarget"
    >
      <XBadge>
        <slot />
      </XBadge>
    </XAction>

    <XBadge v-else>
      <slot />
    </XBadge>
    <TagList
      v-if="props.targetRef.kind === 'MeshServiceSubset' && props.targetRef.tags"
      :tags="props.targetRef.tags"
    />

    <span
      v-if="props.targetRef.weight !== undefined && props.targetRef.weight !== 1"
      class="weight"
    >
      <!-- TODO: Replace this with the @kong/icons icon once available -->
      <img
        src="@/assets/images/icon-weight.svg?url"
        alt="Weight"
      >
      {{ props.targetRef.weight }}
    </span>
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import TagList from '@/app/common/TagList.vue'
import type { TargetRef } from '@/types/index.d'
import type { RouteLocationNamedRaw } from 'vue-router'

const props = defineProps<{
  targetRef: TargetRef
}>()

const routeTarget = computed<Omit<RouteLocationNamedRaw, 'query'> | null>(() => {
  if (!props.targetRef.name) {
    return null
  }

  switch (props.targetRef.kind) {
    case 'MeshService':
    case 'MeshServiceSubset': {
      // The legacy internal service detail view has been removed, so there is
      // no route to link a bare `kuma.io/service` name to. Render as a plain
      // badge instead of a (broken) link.
      return null
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
  gap: var(--x-space-40);
}

.weight {
  display: inline-flex;
  align-items: center;
  gap: var(--x-space-20);
  color: var(--x-color-text-neutral);
}
</style>
