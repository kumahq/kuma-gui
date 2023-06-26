import { DataSourceResponse } from '@/app/application/services/data-source/DataSource'
import type KumaApi from '@/services/kuma-api/KumaApi'
import type {
  MeshInsight,
} from '@/types/index.d'
type MeshParams = {
  mesh: string
}
export type MeshInsightSource = DataSourceResponse<MeshInsight>
export const sources = (api: KumaApi) => {
  return {
    '/:mesh/insights': async (params: MeshParams, source: {close: () => void}) => {
      source.close()
      return api.getMeshInsights({ name: params.mesh })
    },
  }
}
