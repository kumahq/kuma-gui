import type { components } from '@/types/auto-generated.d'

type GeneratedInspectHostnames = components['responses']['InspectHostnamesResponse']['content']['application/json']
type GeneratedInspectHostname = components['responses']['InspectHostnamesResponse']['content']['application/json']['items'][number]

export const InspectHostname = {
  fromObject(item: GeneratedInspectHostname) {
    return item
  },

  fromCollection(collection: GeneratedInspectHostnames) {
    const items = Array.isArray(collection.items) ? collection.items.map(InspectHostname.fromObject) : []

    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}
export type InspectHostname = ReturnType<typeof InspectHostname['fromObject']>