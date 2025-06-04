import { Resource } from '@/app/resources/data/Resource'
import type { components } from '@kumahq/kuma-http-api'

type PartialMeshInsightCollection = components['responses']['MeshInsightCollection']['content']['application/json']
type PartialMeshInsight = components['schemas']['MeshInsight']

const MeshInsightDataplaneStatistics = {
  fromObject({
    total = 0,
    online = 0,
    partiallyDegraded = 0,
    offline = 0,
  }: {
    total?: number
    online?: number
    partiallyDegraded?: number
    offline?: number
  }) {
    return {
      total,
      online,
      partiallyDegraded,
      offline,
    }
  },
}

export const MeshInsight = {
  search(query: string) {
    return Resource.search(query)
  },

  fromObject(item: PartialMeshInsight) {
    return {
      ...item,
      dataplanes: MeshInsightDataplaneStatistics.fromObject(item.dataplanes ?? {}),
      dataplanesByType: {
        ...item.dataplanesByType,
        standard: MeshInsightDataplaneStatistics.fromObject(item.dataplanesByType?.standard ?? {}),
        gateway: MeshInsightDataplaneStatistics.fromObject(item.dataplanesByType?.gateway ?? {}),
        gatewayBuiltin: MeshInsightDataplaneStatistics.fromObject(item.dataplanesByType?.gatewayBuiltin ?? {}),
        gatewayDelegated: MeshInsightDataplaneStatistics.fromObject(item.dataplanesByType?.gatewayDelegated ?? {}),
      },
      services: {
        ...item.services,
        total: item.services?.total ?? 0,
        internal: item.services?.internal ?? 0,
        external: item.services?.external ?? 0,
      },
      policies: Object.fromEntries(Object.entries(item?.policies ?? {}).map(([key, value]) => [key, {
        total: value.total ?? 0,
      }])),
      resources: Object.fromEntries(Object.entries(item?.resources ?? {}).map(([key, value]) => [key, {
        total: value.total ?? 0,
      }])),
    }
  },

  fromCollection(collection: PartialMeshInsightCollection) {
    const items = Array.isArray(collection.items) ? collection.items.map(MeshInsight.fromObject) : []
    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}
export type MeshInsight = ReturnType<typeof MeshInsight.fromObject>
