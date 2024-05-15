import type { PaginatedApiListResponse } from '@/types/api.d'
import type {
  MeshService as PartialMeshService,
  ExternalService as PartialExternalService,
  ServiceInsight as PartialServiceInsight,
  ServiceStatus as ServiceTypeCount,
} from '@/types/index.d'

export type ExternalService = PartialExternalService & {
  config: PartialExternalService
}
export type MeshService = PartialMeshService & {
  config: PartialMeshService
  namespace: string
}

export type ServiceInsight = PartialServiceInsight & {
  serviceType: 'internal' | 'external' | 'gateway_builtin' | 'gateway_delegated'
  status: 'online' | 'offline' | 'partially_degraded' | 'not_available'
}

export const ExternalService = {
  fromObject(partialExternalService: PartialExternalService): ExternalService {
    return {
      ...partialExternalService,
      config: partialExternalService,
    }
  },
}

export const ServiceInsight = {
  fromObject(partialServiceInsight: PartialServiceInsight): ServiceInsight {
    const serviceType = partialServiceInsight.serviceType ?? 'internal'
    const status = partialServiceInsight.status ?? 'not_available'

    return {
      ...partialServiceInsight,
      serviceType,
      status,
    }
  },

  fromCollection(partialServiceInsights: PaginatedApiListResponse<PartialServiceInsight>): PaginatedApiListResponse<ServiceInsight> {
    return {
      ...partialServiceInsights,
      items: Array.isArray(partialServiceInsights.items)
        ? partialServiceInsights.items.map((partialServiceInsight) => ServiceInsight.fromObject(partialServiceInsight))
        : [],
    }
  },
}
export const MeshService = {
  fromObject(item: PartialMeshService): MeshService {
    const labels = item.labels ?? {}
    const name = labels['kuma.io/display-name'] ?? item.name
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''

    return {
      ...item,
      config: item,
      name,
      namespace,
    }
  },

  fromCollection(collection: PaginatedApiListResponse<PartialMeshService>): PaginatedApiListResponse<MeshService> {
    const items = Array.isArray(collection.items) ? collection.items.map(MeshService.fromObject) : []
    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}

export function getServiceTypeCount({ total = 0, internal = 0, external = 0 }: ServiceTypeCount): Required<ServiceTypeCount> {
  return {
    total,
    internal,
    external,
  }
}
