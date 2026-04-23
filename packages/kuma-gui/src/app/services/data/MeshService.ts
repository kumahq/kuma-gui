import { Kri } from '@/app/kuma'
import { Resource } from '@/app/resources/data/Resource'
import type { components } from '@kumahq/kuma-http-api'
export type KumaMeshService = components['schemas']['MeshServiceItem']
type KumaMeshServiceCollection = components['responses']['MeshServiceList']['content']['application/json']

export const MeshService = {
  search(query: string) {
    return Resource.search(query)
  },

  fromObject(item: KumaMeshService) {
    const labels = item.labels ?? {}
    const name = labels['kuma.io/display-name'] ?? item.name
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    const mesh = labels['kuma.io/mesh'] ?? item.mesh ?? ''
    const zone = labels['kuma.io/origin'] === 'zone' && labels['kuma.io/zone'] ? labels['kuma.io/zone'] : ''
    return {
      ...item,
      id: item.name,
      name,
      namespace,
      labels,
      zone,
      kri: item.kri ?? Kri.toString({ shortName: 'msvc', mesh, zone, namespace, name: name.substring(0, Math.max(name.indexOf('.'), 0) || name.length) }),
      spec: ((item) => {
        return {
          ...item,
          ports: Array.isArray(item.ports) ? item.ports : [],
          selector: ((item = {}) => {
            return {
              dataplaneTags: Object.keys(item.dataplaneTags ?? {}).length > 0 ? item.dataplaneTags! : {},
            }
          })(item.selector),
          identities: Array.isArray(item.identities) ? item.identities : [],
        }
      })(item.spec),
      status: ((item = {}) => {
        return {
          ...item,
          tls: typeof item.tls !== 'undefined' ? item.tls : { status: 'NotReady' },
          vips: Array.isArray(item.vips) ? item.vips : [],
          dataplaneProxies: ((item = {}) => ({
            connected: item.connected ?? 0,
            total: item.total ?? 0,
            healthy: item.healthy ?? 0,
          }))(item.dataplaneProxies),
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

  fromCollection(collection: KumaMeshServiceCollection) {
    const items = Array.isArray(collection.items) ? collection.items.map(MeshService.fromObject) : []
    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}
export type MeshService = ReturnType<typeof MeshService['fromObject']>
