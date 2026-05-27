import { Kri } from '@/app/kuma/kri'
import type { components } from '@kumahq/kuma-http-api'

export type KumaMeshTrustList = components['responses']['MeshTrustList']['content']['application/json']
export type KumaMeshTrust = components['schemas']['MeshTrustItem']

export const MeshTrust = {
  fromObject: (item: KumaMeshTrust) => {
    const labels = item.labels ?? {}
    const id = item.name
    const mesh = item.mesh
    const zone = labels['kuma.io/origin'] === 'zone' && labels['kuma.io/zone'] ? labels['kuma.io/zone'] : ''
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    const name = labels['kuma.io/display-name'] ?? item.name

    return {
      // defaults
      kri: Kri.toString({ shortName: 'mtrust', mesh, zone, namespace, name }),
      creationTime: '',
      modificationTime: '',
      labels,
      // overwrite
      ...item,
      name,
      mesh,
      // aliases
      id,
      namespace,
      zone,
      raw: item,
      //
      status: {
        ...item.status,
        origin: {
          ...item.status?.origin,
          kri: item.status?.origin?.kri ?? '',
        },
      },
    }
  },

  fromCollection: (collection: KumaMeshTrustList) => {
    const items = Array.isArray(collection.items) ? collection.items.map(MeshTrust.fromObject) : []
    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}

export type MeshTrust = ReturnType<typeof MeshTrust.fromObject>
