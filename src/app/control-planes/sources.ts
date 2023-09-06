import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type Env from '@/services/env/Env'

export type ControlPlaneAddresses = {
  http: string
  kds: string
}

export type ControlPlaneAddressesSource = DataSourceResponse<ControlPlaneAddresses>
export const sources = (env: Env['var']) => {
  return {
    '/control-plane/addresses': async (_params: {}, source: { close: () => void }): Promise<ControlPlaneAddresses> => {
      source.close()
      return {
        http: env('KUMA_API_URL'),
        kds: 'grpcs://<global-kds-address>:5685',
      }
    },
  }
}
