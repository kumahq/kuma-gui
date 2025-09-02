import { Kri } from '@/app/kuma/kri'
import type { components } from '@kumahq/kuma-http-api'

type PartialMeshIdentityList = components['responses']['MeshIdentityList']['content']['application/json']
type PartialMeshIdentity = components['schemas']['MeshIdentityItem']

export const MeshIdentity = {
  fromObject: (item: PartialMeshIdentity) => {
    return {
      ...item,
      kri: Kri.toString({ shortName: 'mid', mesh: item.mesh, name: item.name}),
      raw: item,
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