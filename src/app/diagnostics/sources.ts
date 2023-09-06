import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { Config } from '@/types/config.d'

export type { Config } from '@/types/config.d'
export type ConfigSource = DataSourceResponse<Config>

export const sources = (api: KumaApi) => {
  return {
    '/config': async (_params: {}, source: { close: () => void }) => {
      source.close()

      return await api.getConfig()
    },
  }
}
