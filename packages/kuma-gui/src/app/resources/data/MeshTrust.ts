import { Kri } from '@/app/kuma/kri'
import type { components } from '@kumahq/kuma-http-api'

type PartialMeshTrustList = components['responses']['MeshTrustList']['content']['application/json']
type PartialMeshTrust = components['schemas']['MeshTrustItem']

export const MeshTrust = {
  fromObject: (item: PartialMeshTrust) => {
    return {
      kri: Kri.toString({ kind: 'mtrust', mesh: item.mesh, name: item.name }),
      ...item,
      spec: {
        ...item.spec,
        origin: {
          ...item.spec.origin,
          kri: item.spec?.origin?.kri ?? '',
        },
      },
      raw: item,
    }
  },

  fromCollection: (collection: PartialMeshTrustList) => {
    return {
      ...collection,
      items: collection.items?.map((item) => MeshTrust.fromObject(item)) ?? [],
    }
  },
}

export type MeshTrust = ReturnType<typeof MeshTrust.fromObject>
