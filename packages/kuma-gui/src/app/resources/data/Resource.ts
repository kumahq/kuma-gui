import { Kri, search } from '@/app/kuma'
import type { paths } from '@kumahq/kuma-http-api'

/**
 * There is no types based on OAS that guarantee the shape of a generic resource collection.
 * Therefore we are only assuming that it's an object of unknown entries and we shape it to what we expect in the data layer.
 */
type KumaResourceCollection = Record<string, unknown>
type KumaResource = paths['/_kri/{kri}']['get']['responses']['200']['content']['application/json']

export const Resource = {
  search(...rest: Parameters<typeof search>) {
    return search(...rest)
  },

  fromObject(partialResource: KumaResource) {
    const labels = 'labels' in partialResource ? partialResource.labels ?? {} : {}
    const mesh = 'mesh' in partialResource ? partialResource.mesh : labels['kuma.io/mesh'] ?? ''
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    const name = labels['kuma.io/display-name'] ?? partialResource.name ?? ''
    const zone = labels['kuma.io/origin'] === 'zone' ? labels['kuma.io/zone'] ?? '' : ''

    const kri = 'kri' in partialResource ? partialResource.kri ?? '' : ''

    return {
      ...partialResource,
      config: partialResource,
      id: partialResource.name,
      kri: Kri.isKriString(kri) ? kri : Kri.toString({ shortName: `~${partialResource.type?.toLowerCase()}`, mesh, zone, namespace, name }),
      mesh,
      namespace,
      name,
      zone,
      creationTime: 'creationTime' in partialResource ? partialResource.creationTime ?? '' : '',
      modificationTime: 'modificationTime' in partialResource ? partialResource.modificationTime ?? '' : '',
      labels: partialResource.labels ?? {},
    }
  },

  fromCollection(partialResources: KumaResourceCollection = {}) {
    const collection = Object.values(partialResources).find((value) => Array.isArray(value)) ?? []
    return {
      ...partialResources,
      items: collection.map(Resource.fromObject),
      total: partialResources.total as number | undefined ?? collection.length ?? 0,
    }
  },
}

export type Resource = ReturnType<typeof Resource.fromObject>
export type ResourceCollection = ReturnType<typeof Resource.fromCollection>
