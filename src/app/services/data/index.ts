import type { PaginatedApiListResponse } from '@/types/api.d'
import type {
  ExternalService as PartialExternalService,
  ServiceInsight as PartialServiceInsight,
  ServiceStatus as ServiceTypeCount,
} from '@/types/index.d'

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

export function getServiceTypeCount({ total = 0, internal = 0, external = 0 }: ServiceTypeCount): Required<ServiceTypeCount> {
  return {
    total,
    internal,
    external,
  }
}
