import type { PaginatedApiListResponse } from '@/types/api.d'
import type {
  ExternalService as PartialExternalService,
} from '@/types/index.d'

export type ExternalService = PartialExternalService & {
  config: PartialExternalService
}

export const ExternalService = {
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
