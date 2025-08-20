import type { components } from '@kumahq/kuma-http-api'

type PartialMeshTrustList = components['responses']['MeshTrustList']['content']['application/json']
type PartialMeshTrust = components['schemas']['MeshTrustItem']

export const MeshTrust = {
  fromObject: (item: PartialMeshTrust) => {
    return {
      ...item,
      spec: {
        ...item.spec,
        origin: {
          ...item.spec.origin,
          kri: item.spec?.origin?.kri ?? '',
        },
      },
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
