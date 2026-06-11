import { Kri } from '@/app/kuma/kri'
import { Resource } from '@/app/resources/data/Resource'
import type { components } from '@kumahq/kuma-http-api'
type Generated = components['schemas']['MeshMultiZoneServiceItem']
type GeneratedCollection = components['responses']['MeshMultiZoneServiceList']['content']['application/json']

const Entity = {
  search(query: string) {
    return Resource.search(query)
  },

  fromObject(item: Generated) {
    const labels = item.labels ?? {}
    const id = item.name
    const mesh = item.mesh
    const zone = labels['kuma.io/origin'] === 'zone' && labels['kuma.io/zone'] ? labels['kuma.io/zone'] : ''
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    const name = labels['kuma.io/display-name'] ?? item.name

    return {
      ...item,
      kri: item.kri ?? Kri.toString({ shortName: 'mzsvc', mesh, zone, namespace, name }),
      name,
      mesh,
      labels,
      creationTime: item.creationTime ?? '',
      modificationTime: item.modificationTime ?? '',
      // aliases
      id,
      namespace,
      zone,
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

  fromCollection(collection: GeneratedCollection) {
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
