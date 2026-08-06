import { Origin } from './Origin'
import type { ResourceTypeDescriptorCollection } from '@/app/resources/data'
import type { components } from '@kumahq/kuma-http-api'
type Entity = components['schemas']['ResourceRule']
type Collection = Entity[]

export const ResourceRule = {
  fromObject(item: Entity, resources: ResourceTypeDescriptorCollection) {
    const labels = typeof item.resourceMeta.labels !== 'undefined' ? item.resourceMeta.labels : {}
    const origins = Array.isArray(item.origin) ?
      item.origin.map((origin) => 
        ({
          ...origin,
          ...(origin.resourceMeta && { resourceMeta: Origin.fromObject(origin.resourceMeta, resources) }),
        }),
      ) : []

    return {
      ...item,
      type: '',
      raw: item.conf[0] ?? {},
      config: item.conf[0] ?? {},
      origins,
      labels,
      id: item.resourceMeta.name,
      name: labels['kuma.io/display-name'] ?? item.resourceMeta.name,
      namespace: labels['k8s.kuma.io/namespace'] ?? '',
      zone: labels['kuma.io/zone'] ?? '',
      port: item.resourceSectionName ?? '',
    }
  },

  fromCollection(collection: Collection, resources: ResourceTypeDescriptorCollection) {
    const items = Array.isArray(collection) ? collection.map((item) => ResourceRule.fromObject(item, resources)) : []
    return {
      items,
      total: items.length,
    }
  },
}
export type ResourceRule = ReturnType<typeof ResourceRule['fromObject']>
