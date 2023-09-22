import { DataSourceResponse } from '@/app/application/services/data-source/DataSourcePool'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type { GlobalInsight } from '@/types/index.d'

type Closeable = { close: () => void }

export type GlobalInsightSource = DataSourceResponse<GlobalInsight>

export const sources = (api: KumaApi) => {
  return {
    '/global-insight': (_params: {}, source: Closeable) => {
      source.close()

      return api.getGlobalInsight()
    },
  }
}
