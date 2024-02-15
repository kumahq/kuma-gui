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
      :appearance="tag.isKuma ? 'info' : 'neutral'"
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

import { useCan } from '@/app/application'
import type { LabelValue, Tags } from '@/types/index.d'
import { getLabels } from '@/utilities/getLabels'
import type { RouteLocationNamedRaw } from 'vue-router'

interface LabelValueWithRoute extends LabelValue {
  route: RouteLocationNamedRaw | undefined
  isKuma: boolean
}

const dataplaneTypeToServiceTypeMap = {
  standard: 'internal',
  builtin: 'gateway_builtin',
  delegated: 'gateway_delegated',
} as const

const props = withDefaults(defineProps<{
  tags: LabelValue[] | Tags | null | undefined
  shouldTruncate?: boolean
  alignment?: 'left' | 'right'
  dataplaneType?: 'standard' | 'builtin' | 'delegated'
  serviceType?: 'internal' | 'external' | 'gateway_builtin' | 'gateway_delegated'
}>(), {
  shouldTruncate: false,
  alignment: 'left',
  dataplaneType: undefined,
  serviceType: undefined,
})
const can = useCan()

const serviceType = computed(() => {
  if (props.serviceType) {
    return props.serviceType
  }

  if (props.dataplaneType) {
    return dataplaneTypeToServiceTypeMap[props.dataplaneType]
  }

  return undefined
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

  switch (tag.label) {
    case 'kuma.io/zone': {
      if (!can('use zones')) {
        return undefined
      }
      return {
        name: 'zone-cp-detail-view',
        params: {
          zone: tag.value,
        },
      }
    }
    case 'kuma.io/service': {
      // Service annotations can refer to various service types which all have their dedicated detail views. To know which one to link to, we need to know the corresponding service type. In cases where we don’t know it, we can’t reliably link to a detail view. **Importantly**, we can’t generally link to the built-in gateway detail view or the external service detail view because those resources generally have _different_ names than their corresponding `ServiceInsight` objects and so an API call based on the latters name would fail.
      switch (serviceType.value) {
        case 'internal': {
          return {
            name: 'service-detail-view',
            params: {
              service: tag.value,
            },
          }
        }
        case 'gateway_delegated': {
          return {
            name: 'delegated-gateway-detail-view',
            params: {
              service: tag.value,
            },
          }
        }
        default: {
          return undefined
        }
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
.tag-list {
  display: inline-flex;
  flex-wrap: wrap;
  gap: $kui-space-40;
}

.tag-list--align-right,
.tag-list--align-right :deep(.k-truncate-container) {
  justify-content: flex-end;
}

.tag {
  font-weight: $kui-font-weight-regular;
}

.tag :deep(a) {
  color: currentColor;
}
</style>
