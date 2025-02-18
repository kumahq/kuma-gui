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
      resources: {
        ...partialGlobalInsight.resources,
        MeshService: {
          ...partialGlobalInsight.resources.MeshService,
          total: partialGlobalInsight.resources.MeshService?.total ?? 0,
        },
        MeshMultiZoneService: {
          ...partialGlobalInsight.resources.MeshMultiZoneService,
          total: partialGlobalInsight.resources.MeshMultiZoneService?.total ?? 0,
        },
        MeshExternalService: {
          ...partialGlobalInsight.resources.MeshExternalService,
          total: partialGlobalInsight.resources.MeshExternalService?.total ?? 0,
        },
      },
    }
  },
}

export type GlobalInsight = ReturnType<typeof GlobalInsight.fromObject>
