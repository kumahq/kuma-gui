import { ControlPlaneConfig, GlobalInsight } from './data'
import type { DataSourceResponse } from '@/app/application'
import type Env from '@/services/env/Env'
import type KumaApi from '@/services/kuma-api/KumaApi'

export type ControlPlaneAddresses = {
  http: string
  kds: string
}

export type ControlPlaneAddressesSource = DataSourceResponse<ControlPlaneAddresses>

export type ControlPlaneConfigSource = DataSourceResponse<ControlPlaneConfig>

export type GlobalInsightSource = DataSourceResponse<GlobalInsight>

export const sources = (env: Env['var'], api: KumaApi) => {
  return {
    '/control-plane/addresses': async (): Promise<ControlPlaneAddresses> => {
      return {
        http: env('KUMA_API_URL'),
        kds: env('KUMA_KDS_URL'),
      }
    },

    '/config': async () => {
      return ControlPlaneConfig.fromObject(await api.getConfig())
    },

    '/global-insight': async () => {
      return GlobalInsight.fromObject(await api.getGlobalInsight())
    },
  }
}
