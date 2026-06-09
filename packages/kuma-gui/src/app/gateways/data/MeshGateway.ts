import { Kri } from '@/app/kuma/kri'
import { Resource } from '@/app/resources/data/Resource'
import type { components } from '@kumahq/kuma-http-api'

type KumaMeshGatewayList = components['responses']['MeshGatewayList']['content']['application/json']
type KumaMeshGateway = components['schemas']['MeshGatewayItem']

export const MeshGateway = {
  search(query: string) {
    return Resource.search(query)
  },

  fromObject(item: KumaMeshGateway) {
    const labels = item.labels ?? {}
    const id = item.name
    const mesh = item.mesh
    const zone = labels['kuma.io/origin'] === 'zone' && labels['kuma.io/zone'] ? labels['kuma.io/zone'] : ''
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    const name = labels['kuma.io/display-name'] ?? item.name

    return {
      ...item,
      kri: 'kri' in item ? item.kri ?? Kri.toString({ shortName: 'mgw', mesh, zone, namespace, name }) : '',
      name,
      mesh,
      labels,
      creationTime: String('creationTime' in item ? item.creationTime ?? '' : ''),
      modificationTime: String('modificationTime' in item ? item.modificationTime ?? '' : ''),
      // aliases
      id,
      namespace,
      zone,
      origin: labels['kuma.io/origin'] ?? '',
      config: item,
      selectors: Array.isArray(item.selectors) ? item.selectors : [],
      conf: ((item = {}) => ({
        ...item,
        listeners: Array.isArray(item.listeners)
          ? item.listeners.map(item => {
            return {
              ...item,
              // An omitted hostname implies the wildcard hostname (meaning any hostname applies).
              hostname: item.hostname ?? '*',
              protocol: typeof item.protocol !== 'undefined' ? String(item.protocol) : 'TCP',
            }
          })
          : [],
      }))(item.conf),
    }
  },

  fromCollection(collection: KumaMeshGatewayList) {
    const items = Array.isArray(collection.items) ? collection.items.map(MeshGateway.fromObject) : []
    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}
export type MeshGateway = ReturnType<typeof MeshGateway['fromObject']>
