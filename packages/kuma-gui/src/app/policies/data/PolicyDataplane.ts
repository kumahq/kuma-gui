import type { PaginatedApiListResponse } from '@/types/api.d'
import type {
  PolicyDataplane as PartialPolicyDataplane,
} from '@/types/index.d'

export const PolicyDataplane = {
  fromObject(item: PartialPolicyDataplane) {
    const labels = typeof item.labels !== 'undefined' ? item.labels : {}
    return {
      ...item,
      id: item.name,
      labels,
      zone: labels['kuma.io/zone'] ?? '',
      name: labels['kuma.io/display-name'] ?? item.name,
      namespace: labels['k8s.kuma.io/namespace'] ?? '',
    }
  },

  fromCollection(collection: PaginatedApiListResponse<PartialPolicyDataplane>) {
    const items = Array.isArray(collection.items) ? collection.items.map(PolicyDataplane.fromObject) : []
    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}
export type PolicyDataplane = ReturnType<typeof PolicyDataplane['fromObject']>

