import { Kri } from '@/app/kuma'
import { Resource } from '@/app/resources/data/Resource'
import type { components } from '@kumahq/kuma-http-api'
export type KumaMeshMultiZoneService = components['schemas']['MeshMultiZoneServiceItem']
type KumaMeshMultiZoneServiceCollection = components['responses']['MeshMultiZoneServiceList']['content']['application/json']

const Entity = {
  search(query: string) {
    return Resource.search(query)
  },

  fromObject(item: KumaMeshMultiZoneService) {
    const labels = item.labels ?? {}
    const name = labels['kuma.io/display-name'] ?? item.name
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    const mesh = labels['kuma.io/mesh'] ?? item.mesh ?? ''
    return {
      ...item,
      id: item.name,
      name,
      mesh,
      namespace,
      labels,
      kri: item.kri ?? Kri.toString({ shortName: 'mmzsvc', mesh, namespace, name: name.substring(0, Math.max(name.indexOf('.'), 0) || name.length) }),
      spec: ((item) => {
        return {
          ...item,
          ports: Array.isArray(item.ports) ? item.ports : [],
        }
      })(item.spec),
      status: ((item = {}) => {
        return {
          ...item,
          vips: Array.isArray(item.vips) ? item.vips : [],
          meshServices: Array.isArray(item.meshServices) ? item.meshServices : [],
          addresses: Array.isArray(item.addresses) ? item.addresses : [],
        }
      })(item.status),
      config: item,
    }
  },

  fromCollection(collection: KumaMeshMultiZoneServiceCollection) {
    const items = Array.isArray(collection.items) ? collection.items.map(Entity.fromObject) : []
    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}
export const MeshMultiZoneService = Entity
export type MeshMultiZoneService = ReturnType<typeof Entity['fromObject']>
