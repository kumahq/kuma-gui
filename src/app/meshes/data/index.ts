import { getDataplaneStatusCounts } from '@/app/data-planes/data'
import { getServiceTypeCount } from '@/app/services/data'
import type { PaginatedApiListResponse } from '@/types/api.d'
import type {
  Backend,
  MeshBackend,
  Mesh as PartialMesh,
  MeshInsight as PartialMeshInsight,
} from '@/types/index.d'

export type Mesh = PartialMesh & {
  config: PartialMesh
  mtlsBackend: Backend | undefined
  metricsBackend: Backend | undefined
}

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

export const Mesh = {
  fromObject(partialMesh: PartialMesh): Mesh {
    const mtlsBackend = getBackend(partialMesh.mtls)
    const metricsBackend = getBackend(partialMesh.metrics)

    return {
      ...partialMesh,
      config: partialMesh,
      mtlsBackend,
      metricsBackend,
    }
  },
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

  fromCollection(partialMeshInsights: PaginatedApiListResponse<PartialMeshInsight>): PaginatedApiListResponse<MeshInsight> {
    return {
      ...partialMeshInsights,
      items: Array.isArray(partialMeshInsights.items)
        ? partialMeshInsights.items.map((partialMeshInsight) => MeshInsight.fromObject(partialMeshInsight))
        : [],
    }
  },
}

function getBackend(meshBackend?: MeshBackend): Backend | undefined {
  if (meshBackend?.enabledBackend && Array.isArray(meshBackend.backends)) {
    return meshBackend.backends.find((backend) => backend.name === meshBackend.enabledBackend)
  }

  return undefined
}
