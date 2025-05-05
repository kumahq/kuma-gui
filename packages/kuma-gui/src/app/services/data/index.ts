import type { PaginatedApiListResponse } from '@/types/api.d'
import type {
  ExternalService as PartialExternalService,
  ServiceInsight as PartialServiceInsight,
  ServiceStatus as ServiceTypeCount,
} from '@/types/index.d'

export * from './MeshService'
export * from './MeshMultiZoneService'
export * from './MeshExternalService'
export * from './Hostname'

export type ExternalService = PartialExternalService & {
  config: PartialExternalService
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
  search(query: string) {
    const parts = query.trim().split(/\s+/)
    return parts.reduce((acc, curr) => {
      const [key, value] = curr.split(/:(.*)/)
      switch(true) {
        case Boolean(value):
          return {
            ...acc,
            [key]: value,
          }
        case curr.includes(':') || (!key && !value):
          // at this point this would be an invalid query, i.e. `name:`
          return acc
        default:
          return {
            ...acc,
            name: key,
          }
      }
    }, {})
  },
  fromObject(partialServiceInsight: PartialServiceInsight): ServiceInsight {
    const serviceType = partialServiceInsight.serviceType ?? 'internal'
    const status = partialServiceInsight.status ?? 'not_available'
    const addressPort = partialServiceInsight.addressPort?.replaceAll('_', '.')

    return {
      ...partialServiceInsight,
      serviceType,
      status,
      addressPort,
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

export function getServiceTypeCount({ total = 0, internal = 0, external = 0 }: ServiceTypeCount): Required<ServiceTypeCount> {
  return {
    total,
    internal,
    external,
  }
}
