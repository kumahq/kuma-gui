import { search } from '@/app/kuma'
import type { PaginatedApiListResponse } from '@/types/api.d'
import type {
  ServiceInsight as PartialServiceInsight,
} from '@/types/index.d'

export type ServiceInsight = PartialServiceInsight & {
  serviceType: 'internal' | 'external' | 'gateway_builtin' | 'gateway_delegated'
  status: 'online' | 'offline' | 'partially_degraded' | 'not_available' | 'disconnected_cp'
}

export const ServiceInsight = {
  search(query: string) {
    return search(query)
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
