import { Kri } from '@/app/kuma'
import type { PaginatedApiListResponse } from '@/types/api.d'
import type {
  PolicyDataplane as PartialPolicyDataplane,
} from '@/types/index.d'

export const PolicyDataplane = {
  fromObject(item: PartialPolicyDataplane) {
    const labels = item.labels ?? {}
    const id = item.name
    const mesh = item.mesh
    const zone = labels['kuma.io/origin'] === 'zone' && labels['kuma.io/zone'] ? labels['kuma.io/zone'] : ''
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    const name = labels['kuma.io/display-name'] ?? item.name

    return {
      ...item,
      id,
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

