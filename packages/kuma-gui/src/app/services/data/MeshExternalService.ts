import { Kri } from '@/app/kuma'
import { Resource } from '@/app/resources/data/Resource'
import type { components } from '@kumahq/kuma-http-api'
export type KumaMeshExternalService = components['schemas']['MeshExternalServiceItem']
type KumaMeshExternalServiceCollection = components['responses']['MeshExternalServiceList']['content']['application/json']

export const MeshExternalService = {
  search(query: string) {
    return Resource.search(query)
  },

  fromObject(item: KumaMeshExternalService) {
    const labels = item.labels ?? {}
    const name = labels['kuma.io/display-name'] ?? item.name
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    const mesh = labels['kuma.io/mesh'] ?? item.mesh ?? ''
    const zone = labels['kuma.io/origin'] === 'zone' && labels['kuma.io/zone'] ? labels['kuma.io/zone'] : ''
    return {
      ...item,
      id: item.name,
      name,
      mesh,
      zone,
      namespace,
      labels,
      kri: item.kri ?? Kri.toString({ shortName: 'extsvc', mesh, zone, namespace, name: name.substring(0, Math.max(name.indexOf('.'), 0) || name.length) }),
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
