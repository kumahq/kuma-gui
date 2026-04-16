import { Kri } from '@/app/kuma'

type KumaResourcesCollection = Record<string, unknown>
type KumaResource = {
  kri?: string
  mesh?: string
  labels?: Record<string, string>
  type?: string
  [key: string]: unknown
}

export const Resources = {
  fromObject(partialResource: KumaResource) {
    const kri = Kri.fromString(partialResource.kri ?? '')
    const mesh = kri.mesh || (partialResource.mesh ?? partialResource.labels?.['kuma.io/mesh'] ?? '')
    const namespace = kri.namespace || (partialResource.labels?.['kuma.io/namespace'] ?? '')
    const name = kri.name || (partialResource.labels?.['kuma.io/display-name'] ??partialResource.name ?? partialResource.labels?.['kuma.io/name'] ?? '') as string
    const zone = kri.zone || (partialResource.zone ?? partialResource.labels?.['kuma.io/zone'] ?? '') as string

    return {
      ...partialResource,
      config: partialResource,
      kri: Kri.isKriString(partialResource.kri ?? '') ? partialResource.kri : Kri.toString({ shortName: `$${partialResource.type?.toLowerCase()}`, mesh, zone, namespace, name }),
      mesh,
      namespace,
      name,
      zone,
      creationTime: partialResource.creationTime as string | undefined,
      modificationTime: partialResource.modificationTime as string | undefined,
      labels: partialResource.labels ?? {},
      type: partialResource.type ?? '',
    }
  },

  fromCollection(partialResources: KumaResourcesCollection = {}) {
    const collection = Object.values(partialResources).find((value) => Array.isArray(value)) ?? []
    return {
      ...partialResources,
      items: collection.map(Resources.fromObject),
      total: partialResources.total as number | undefined ?? collection.length ?? 0,
    }
  },
}

export type Resources = ReturnType<typeof Resources.fromObject>
export type ResourcesCollection = ReturnType<typeof Resources.fromCollection>
