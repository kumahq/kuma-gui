import type { components } from '@/types/auto-generated.d'
type GeneratedMeshService = components['schemas']['MeshServiceItem']
type GeneratedMeshServiceList = components['responses']['MeshServiceList']['content']['application/json']

export const MeshService = {
  fromObject(item: GeneratedMeshService) {
    const labels = item.labels ?? {}
    const name = labels['kuma.io/display-name'] ?? item.name
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    return {
      ...item,
      id: item.name,
      name,
      namespace,
      labels,
      zone: labels['kuma.io/origin'] === 'zone' && labels['kuma.io/zone'] ? labels['kuma.io/zone'] : '',
      spec: ((item = {}) => {
        return {
          ...item,
          ports: Array.isArray(item.ports) ? item.ports : [],
          selector: ((item = {}) => {
            return {
              dataplaneTags: Object.keys(item.dataplaneTags ?? {}).length > 0 ? item.dataplaneTags! : {},
            }
          })(item.selector),
        }
      })(item.spec),
      status: ((item = {}) => {
        return {
          ...item,
          tls: typeof item.tls !== 'undefined' ? item.tls : { status: 'NotReady' },
          vips: Array.isArray(item.vips) ? item.vips : [],
          addresses: Array.isArray(item.addresses) ? item.addresses : [],
        }
      })(item.status),
      config: item,
    }
  },

  fromCollection(collection: GeneratedMeshServiceList) {
    const items = Array.isArray(collection.items) ? collection.items.map(MeshService.fromObject) : []
    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}
export type MeshService = ReturnType<typeof MeshService['fromObject']>
