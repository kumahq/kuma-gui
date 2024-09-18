import { getDataplaneStatusCounts } from '@/app/data-planes/data'
import { getServiceTypeCount } from '@/app/services/data'
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
  totalPolicyCount: number
}
export const MeshInsight = {
  fromObject(partialMeshInsight: PartialMeshInsight): MeshInsight {
    const dataplanes = getDataplaneStatusCounts(partialMeshInsight.dataplanes)
    const dataplanesByType = {
      standard: getDataplaneStatusCounts(partialMeshInsight.dataplanesByType.standard),
      gateway: getDataplaneStatusCounts(partialMeshInsight.dataplanesByType.gateway),
      gatewayBuiltin: getDataplaneStatusCounts(partialMeshInsight.dataplanesByType.gatewayBuiltin),
      gatewayDelegated: getDataplaneStatusCounts(partialMeshInsight.dataplanesByType.gatewayDelegated),
    }
    const services = getServiceTypeCount(partialMeshInsight.services)
    const totalPolicyCount = Object.values(partialMeshInsight.policies ?? {}).reduce((total, stat) => total + stat.total, 0)

    return {
      ...partialMeshInsight,
      dataplanes,
      dataplanesByType,
      services,
      totalPolicyCount,
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
