import { Kri, search } from '@/app/kuma'
import type { components } from '@kumahq/kuma-http-api'

export type KumaMeshZoneAddress = components['schemas']['MeshZoneAddressItem']
export type KumaMeshZoneAddressCollection = components['responses']['MeshZoneAddressList']['content']['application/json']

export const MeshZoneAddress = {
  search(query: string) {
    return search(query)
  },

  fromObject: (item: KumaMeshZoneAddress) => {
    const labels = item.labels ?? {}
    const id = item.name
    const mesh = item.mesh ?? labels['kuma.io/mesh'] ?? ''
    const zone = labels['kuma.io/origin'] === 'zone' && labels['kuma.io/zone'] ? labels['kuma.io/zone'] : ''
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    const name = labels['kuma.io/display-name'] ?? item.name

    return {
      ...item,
      kri: item.kri ?? Kri.toString({ shortName: 'mza', mesh, zone, namespace, name }),
      name,
      mesh,
      labels,
      creationTime: item.creationTime ?? '',
      modificationTime: item.modificationTime ?? '',
      // aliases
      id,
      namespace,
      zone: {
        name: zone,
        kri: Kri.toString({ shortName: 'z', name: zone }),
      },
      $raw: item,
    }
  },

  fromCollection: (collection: KumaMeshZoneAddressCollection) => {
    const items = Array.isArray(collection.items) ? collection.items.map(MeshZoneAddress.fromObject) : []
    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}

export type MeshZoneAddress = ReturnType<typeof MeshZoneAddress.fromObject>
export type MeshZoneAddressCollection = ReturnType<typeof MeshZoneAddress.fromCollection>
