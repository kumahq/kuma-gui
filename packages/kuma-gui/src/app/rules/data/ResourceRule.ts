import type { components } from '@kumahq/kuma-http-api'
type Entity = components['schemas']['ResourceRule']
type Collection = Entity[]

export const ResourceRule = {
  fromObject(item: Entity) {
    const labels = typeof item.resourceMeta.labels !== 'undefined' ? item.resourceMeta.labels : {}
    return {
      ...item,
      type: '',
      raw: item.conf[0] ?? {},
      config: item.conf[0] ?? {},
      origins: Array.isArray(item.origin) ? item.origin : [],
      labels,
      id: item.resourceMeta.name,
      name: labels['kuma.io/display-name'] ?? item.resourceMeta.name,
      namespace: labels['k8s.kuma.io/namespace'] ?? '',
      zone: labels['kuma.io/zone'] ?? '',
      port: item.resourceSectionName ?? '',
    }
  },

  fromCollection(collection: Collection) {
    const items = Array.isArray(collection) ? collection.map(ResourceRule.fromObject) : []
    return {
      items,
      total: items.length,
    }
  },
}
export type ResourceRule = ReturnType<typeof ResourceRule['fromObject']>
