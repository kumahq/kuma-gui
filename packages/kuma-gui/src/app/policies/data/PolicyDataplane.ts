import { Kri } from '@/app/kuma'
import type { PaginatedApiListResponse } from '@/types/api.d'
import type {
  PolicyDataplane as PartialPolicyDataplane,
} from '@/types/index.d'

export const PolicyDataplane = {
  fromObject(item: PartialPolicyDataplane) {
    const labels = typeof item.labels !== 'undefined' ? item.labels : {}
    const mesh = item.mesh
    const zone = labels['kuma.io/zone'] ?? ''
    const displayName = labels['kuma.io/display-name']
    const name = displayName ?? item.name
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''

    return {
      ...item,
      id: item.name,
      kri: Kri.toString({ shortName: 'dp', mesh, zone, namespace, name }),
      mesh,
      labels,
      zone,
      name,
      namespace,
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

