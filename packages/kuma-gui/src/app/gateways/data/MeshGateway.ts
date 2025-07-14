import { Resource } from '@/app/resources/data/Resource'
import type { PaginatedApiListResponse } from '@/types/api.d'
import type {
  MeshGateway as PartialMeshGateway,
} from '@/types/index.d'
type PartialMeshGatewayList = PaginatedApiListResponse<PartialMeshGateway>

export const MeshGateway = {
  search(query: string) {
    return Resource.search(query)
  },

  fromObject(item: PartialMeshGateway) {
    const labels = typeof item.labels !== 'undefined' ? item.labels : {}
    return {
      ...item,
      labels,
      id: item.name,
      zone: labels['kuma.io/zone'] ?? '',
      origin: labels['kuma.io/origin'] ?? '',
      name: labels['kuma.io/display-name'] ?? item.name,
      namespace: labels['k8s.kuma.io/namespace'] ?? '',
      config: item,
      selectors: Array.isArray(item.selectors) ? item.selectors : [],
      conf: ((item = {}) => ({
        ...item,
        listeners: Array.isArray(item.listeners)
          ? item.listeners.map(item => {
            return {
              ...item,
              // An omitted hostname implies the wildcard hostname (meaning any hostname applies).
              hostname: item.hostname ?? '*',
              protocol: item.protocol ?? 'TCP',
            }
          })
          : [],
      }))(item.conf),
    }
  },

  fromCollection(collection: PartialMeshGatewayList) {
    const items = Array.isArray(collection.items) ? collection.items.map(MeshGateway.fromObject) : []
    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}
export type MeshGateway = ReturnType<typeof MeshGateway['fromObject']>
