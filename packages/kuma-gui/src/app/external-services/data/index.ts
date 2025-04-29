import type { PaginatedApiListResponse } from '@/types/api.d'
import type {
  ExternalService as PartialExternalService,
} from '@/types/index.d'

export type ExternalService = PartialExternalService & {
  config: PartialExternalService
}

export const ExternalService = {
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
  fromObject(partialExternalService: PartialExternalService): ExternalService {
    return {
      ...partialExternalService,
      config: partialExternalService,
    }
  },

  fromCollection(partialExternalServices: PaginatedApiListResponse<PartialExternalService>): PaginatedApiListResponse<ExternalService> {
    return {
      ...partialExternalServices,
      items: Array.isArray(partialExternalServices.items)
        ? partialExternalServices.items.map((partialExternalService) => ExternalService.fromObject(partialExternalService))
        : [],
    }
  },
}
