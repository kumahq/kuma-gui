import { Kri } from '@/app/kuma/kri'
import { Resource } from '@/app/resources/data/Resource'
import type { components } from '@kumahq/kuma-http-api'
export type KumaMeshExternalService = components['schemas']['MeshExternalServiceItem']
export type KumaMeshExternalServiceCollection = components['responses']['MeshExternalServiceList']['content']['application/json']

export const MeshExternalService = {
  search(query: string) {
    return Resource.search(query)
  },

  fromObject(item: KumaMeshExternalService) {
    const labels = item.labels ?? {}
    const id = item.name
    const mesh = item.mesh
    const zone = labels['kuma.io/origin'] === 'zone' && labels['kuma.io/zone'] ? labels['kuma.io/zone'] : ''
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    const name = labels['kuma.io/display-name'] ?? item.name

    return {
      ...item,
      kri: item.kri ?? Kri.toString({ shortName: 'extsvc', mesh, zone, namespace, name }),
      name,
      mesh,
      labels,
      creationTime: item.creationTime ?? '',
      modificationTime: item.modificationTime ?? '',
      // aliases
      id,
      namespace,
      zone,
      status: ((item = {}) => {
        return {
          ...item,
          addresses: Array.isArray(item.addresses)
            ? item.addresses.map(item => {
              return {
                ...item,
                hostname: typeof item.hostname === 'string' ? item.hostname : '',
              }
            })
            : [],
        }
      })(item.status),
      config: item,

    }
  },

  fromCollection(collection: KumaMeshExternalServiceCollection) {
    const items = Array.isArray(collection.items) ? collection.items.map(MeshExternalService.fromObject) : []
    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}
export type MeshExternalService = ReturnType<typeof MeshExternalService['fromObject']>
