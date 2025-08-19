import type { components } from '@kumahq/kuma-http-api'

type PartialMeshIdentityList = components['responses']['MeshIdentityList']['content']['application/json']
type PartialMeshIdentity = components['schemas']['MeshIdentityItem']

export const MeshIdentity = {
  fromObject: (item: PartialMeshIdentity) => {
    return {
      ...item,
    }
  },
  
  fromCollection: (collection: PartialMeshIdentityList) => {
    return {
      ...collection,
      items: collection.items?.map((item) => MeshIdentity.fromObject(item)) ?? [],
    }
  },
}

export type MeshIdentity = ReturnType<typeof MeshIdentity.fromObject>