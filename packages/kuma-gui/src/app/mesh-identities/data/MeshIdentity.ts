import { Kri } from '@/app/kuma/kri'
import type { components } from '@kumahq/kuma-http-api'

export type KumaMeshIdentityList = components['responses']['MeshIdentityList']['content']['application/json']
export type KumaMeshIdentity = components['schemas']['MeshIdentityItem']

export const MeshIdentity = {
  fromObject: (item: KumaMeshIdentity) => {
    return {
      kri: Kri.toString({ shortName: 'mid', mesh: item.mesh, name: item.name}),
      ...item,
      raw: item,
    }
  },

  fromCollection: (collection: KumaMeshIdentityList) => {
    return {
      ...collection,
      items: collection.items?.map((item) => MeshIdentity.fromObject(item)) ?? [],
    }
  },
}

export type MeshIdentity = ReturnType<typeof MeshIdentity.fromObject>
