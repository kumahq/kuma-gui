import { Kri } from '@/app/kuma/kri'
import type { components } from '@kumahq/kuma-http-api'

export type KumaMeshTrustList = components['responses']['MeshTrustList']['content']['application/json']
export type KumaMeshTrust = components['schemas']['MeshTrustItem']

export const MeshTrust = {
  fromObject: (item: KumaMeshTrust) => {
    return {
      kri: Kri.toString({ shortName: 'mtrust', mesh: item.mesh, name: item.name }),
      ...item,
      status: {
        ...item.status,
        origin: {
          ...item.status?.origin,
          kri: item.status?.origin?.kri ?? '',
        },
      },
      raw: item,
    }
  },

  fromCollection: (collection: KumaMeshTrustList) => {
    return {
      ...collection,
      items: collection.items?.map((item) => MeshTrust.fromObject(item)) ?? [],
    }
  },
}

export type MeshTrust = ReturnType<typeof MeshTrust.fromObject>
