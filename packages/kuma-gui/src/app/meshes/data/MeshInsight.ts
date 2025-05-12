import { Resource } from '@/app/resources/data/Resource'
import type { PaginatedApiListResponse as CollectionResponse } from '@/types/api.d'
import type {
  MeshInsight as PartialMeshInsight,
} from '@/types/index.d'
export type MeshInsight = PartialMeshInsight & {
  dataplanes: Required<PartialMeshInsight['dataplanes']>
  dataplanesByType: {
    standard: Required<PartialMeshInsight['dataplanesByType']['standard']>
    gateway: Required<PartialMeshInsight['dataplanesByType']['gateway']>
    gatewayBuiltin: Required<PartialMeshInsight['dataplanesByType']['gatewayBuiltin']>
    gatewayDelegated: Required<PartialMeshInsight['dataplanesByType']['gatewayDelegated']>
  }
  services: Required<PartialMeshInsight['services']>
}

function getServiceTypeCount(
  {
    total = 0,
    internal = 0,
    external = 0,
  }: {
    total?: number
    internal?: number
    external?: number
  },
) {
  return {
    total,
    internal,
    external,
  }
}
function getDataplaneStatusCounts(
  {
    total = 0,
    online = 0,
    partiallyDegraded = 0,
    offline = 0,
  }: {
    total?: number
    online?: number
    partiallyDegraded?: number
    offline?: number
  },
) {
  return {
    total,
    online,
    partiallyDegraded,
    offline,
  }
}


export const MeshInsight = {
  search(query: string) {
    return Resource.search(query)
  },

  fromObject(partialMeshInsight: PartialMeshInsight): MeshInsight {
    const dataplanes = getDataplaneStatusCounts(partialMeshInsight.dataplanes)
    const dataplanesByType = {
      standard: getDataplaneStatusCounts(partialMeshInsight.dataplanesByType.standard),
      gateway: getDataplaneStatusCounts(partialMeshInsight.dataplanesByType.gateway),
      gatewayBuiltin: getDataplaneStatusCounts(partialMeshInsight.dataplanesByType.gatewayBuiltin),
      gatewayDelegated: getDataplaneStatusCounts(partialMeshInsight.dataplanesByType.gatewayDelegated),
    }
    const services = getServiceTypeCount(partialMeshInsight.services)
    return {
      ...partialMeshInsight,
      dataplanes,
      dataplanesByType,
      services,
    }
  },

  fromCollection(collection: CollectionResponse<PartialMeshInsight>): CollectionResponse<MeshInsight> {
    const items = Array.isArray(collection.items) ? collection.items.map(MeshInsight.fromObject) : []
    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}
