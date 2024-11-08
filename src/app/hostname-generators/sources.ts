import { HostnameGenerator } from './data/HostnameGenerator'
import { defineSources } from '../application/services/data-source'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'

export const sources = (api: KumaApi) => {
  return defineSources({
    '/hostnamegenerators': async (params) => {
      return HostnameGenerator.fromCollection(await api.getHostnameGenerators(params))
    },

    '/hostnamegenerators/:name': async (params) => {
      const { name } = params

      return HostnameGenerator.fromObject(await api.getHostnameGenerator({ name }))
    },

    '/hostnamegenerators/:name/as/kubernetes': async (params) => {
      const { name } = params

      return api.getHostnameGenerator({ name }, { format: 'kubernetes' })
    },
  })
}
