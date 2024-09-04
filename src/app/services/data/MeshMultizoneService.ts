import type { components } from '@/types/auto-generated.d'
type Generated = components['schemas']['MeshMultiZoneServiceItem']
type GeneratedCollection = components['responses']['MeshMultiZoneServiceList']['content']['application/json']

const Entity = {
  fromObject(item: Generated) {
    const labels = item.labels ?? {}
    const name = labels['kuma.io/display-name'] ?? item.name
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    return {
      ...item,
      id: item.name,
      name,
      namespace,
      labels,
      status: ((item = {}) => {
        return {
          vips: Array.isArray(item.vips) ? item.vips : [],
          meshServices: Array.isArray(item.meshServices) ? item.meshServices : [],
          ports: Array.isArray(item.ports) ? item.ports : [],
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
export const MeshMultizoneService = Entity
export type MeshMultizoneService = ReturnType<typeof Entity['fromObject']>
