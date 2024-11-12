import type { Config as PartialControlPlaneConfig } from '@/types/config.d'
import type { GlobalInsight as PartialGlobalInsight } from '@/types/index.d'

export type ControlPlaneConfig = PartialControlPlaneConfig

export type GlobalInsight = PartialGlobalInsight

export const ControlPlaneConfig = {
  fromObject(partialControlPlaneConfig: PartialControlPlaneConfig): ControlPlaneConfig {
    return partialControlPlaneConfig
  },
}

export const GlobalInsight = {
  fromObject(partialGlobalInsight: PartialGlobalInsight): GlobalInsight {
    return partialGlobalInsight
  },
}
