import type { components } from '@/types/auto-generated.d'

type GeneratedHostnames = components['responses']['InspectHostnamesResponse']['content']['application/json']
type GeneratedHostname = components['responses']['InspectHostnamesResponse']['content']['application/json']['items'][number]

export const Hostname = {
  fromObject(item: GeneratedHostname) {
    return item
  },

  fromCollection(collection: GeneratedHostnames) {
    const items = Array.isArray(collection.items) ? collection.items.map(Hostname.fromObject) : []

    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}
export type Hostname = ReturnType<typeof Hostname['fromObject']>
