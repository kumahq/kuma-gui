import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { ClientConfigInterface } from '@/store/modules/config/config.types'

export type ConfigSource = DataSourceResponse<ClientConfigInterface>

export const sources = (api: KumaApi) => {
  return {
    '/config': async (_params: {}, source: { close: () => void }) => {
      source.close()

      return await api.getConfig()
    },
  }
}
