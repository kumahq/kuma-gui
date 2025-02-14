import { type paths } from '@kumahq/kuma-http-api'

import type { Config as PartialControlPlaneConfig } from '@/types/config.d'

export type ControlPlaneConfig = PartialControlPlaneConfig
export type PartialGlobalInsight = paths['/global-insight']['get']['responses']['200']['content']['application/json']

export const ControlPlaneConfig = {
  fromObject(partialControlPlaneConfig: PartialControlPlaneConfig): ControlPlaneConfig {
    return partialControlPlaneConfig
  },
}

export const GlobalInsight = {
  fromObject(partialGlobalInsight: PartialGlobalInsight) {
    return {
      ...partialGlobalInsight,
      services: {
        ...partialGlobalInsight.services,
        meshServicesGeneric: {
          total: ['MeshService', 'MeshMultiZoneService', 'MeshExternalService']
            .map((serviceType) => partialGlobalInsight.resources[serviceType]?.total ?? 0)
            .reduce((acc, curr) => acc + curr, 0),
        },
      },
    }
  },
}

export type GlobalInsight = ReturnType<typeof GlobalInsight.fromObject>
