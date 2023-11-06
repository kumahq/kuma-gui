import type { DataSourceResponse } from '@/app/application'
import type Env from '@/services/env/Env'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { GlobalInsight } from '@/types/index.d'

export type ControlPlaneAddresses = {
  http: string
  kds: string
}

export type ControlPlaneAddressesSource = DataSourceResponse<ControlPlaneAddresses>
export type GlobalInsightSource = DataSourceResponse<GlobalInsight>

export const sources = (env: Env['var'], api: KumaApi) => {
  return {
    '/control-plane/addresses': async (): Promise<ControlPlaneAddresses> => {
      return {
        http: env('KUMA_API_URL'),
        kds: 'grpcs://<global-kds-address>:5685',
      }
    },
    '/global-insight': () => {
      return api.getGlobalInsight()
    },
  }
}
