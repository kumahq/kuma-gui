import { Kri } from '@/app/kuma/kri'
import type { components } from '@kumahq/kuma-http-api'

type KumaMeshIdentityList = components['responses']['MeshIdentityList']['content']['application/json']
type KumaMeshIdentity = components['schemas']['MeshIdentityItem']

export const MeshIdentity = {
  fromObject: (item: KumaMeshIdentity) => {
    const labels = item.labels ?? {}
    const id = item.name
    const mesh = item.mesh
    const zone = labels['kuma.io/origin'] === 'zone' && labels['kuma.io/zone'] ? labels['kuma.io/zone'] : ''
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    const name = labels['kuma.io/display-name'] ?? item.name

    return {
      ...item,
      kri: item.kri ?? Kri.toString({ shortName: 'mid', mesh, zone, namespace, name }),
      name,
      mesh,
      labels,
      creationTime: item.creationTime ?? '',
      modificationTime: item.modificationTime ?? '',
      // aliases
      id,
      namespace,
      zone,
      raw: item,
      //
    }
  },

  fromCollection: (collection: KumaMeshIdentityList) => {
    const items = Array.isArray(collection.items) ? collection.items.map(MeshIdentity.fromObject) : []
    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}

export type MeshIdentity = ReturnType<typeof MeshIdentity.fromObject>
