import type { components } from '@/types/auto-generated.d'
type Entity = components['schemas']['ResourceRule']
type Collection = Entity[]

export const ResourceRule = {
  fromObject(item: Entity) {
    return {
      ...item,
      type: '',
      raw: item.conf[0] ?? {},
      config: item.conf[0] ?? {},
      origins: Array.isArray(item.origin) ? item.origin : [],
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
