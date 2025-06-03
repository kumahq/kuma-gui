import { Mesh, MeshInsight } from './data'
import { defineSources } from '../application/services/data-source'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'

export const sources = (api: KumaApi) => {
  return defineSources({
    '/meshes/:name': async (params) => {
      const { name } = params

      return Mesh.fromObject(await api.getMesh({ name }))
    },

    '/meshes/:name/as/kubernetes': (params) => {
      const { name } = params
      return api.getMesh({ name }, { format: 'kubernetes' })
    },

    '/mesh-insights': async (params) => {
      const { size } = params
      const offset = params.size * (params.page - 1)
      const search = MeshInsight.search(params.search)

      return MeshInsight.fromCollection(await api.getAllMeshInsights({ size, offset, ...search }))
    },

    '/mesh-insights/:name': async (params) => {
      const { name } = params

      return MeshInsight.fromObject(await api.getMeshInsights({ name }))
    },
  })
}
