import { Resource } from '@/app/resources/data/Resource'
import type { components } from '@kumahq/kuma-http-api'

type PartialMeshInsightCollection = components['schemas']['MeshInsightCollection']
type PartialMeshInsight = components['schemas']['MeshInsight']
type MeshInsightsResources = Record<string, { total: number }>
  & Record<
    | 'MeshService'
    | 'MeshExternalService'
    | 'MeshMultiZoneService'
    | 'MeshServiceGeneric',
    { total: number }>

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
      resources: {
        ...Object.fromEntries(Object.entries(item?.resources ?? {}).map(([key, value]) => [key, {
          total: value.total ?? 0,
        }])),
        ...(() => {
          const meshServices = {
            MeshService: {
              ...item.resources?.MeshService,
              total: item.resources?.MeshService?.total ?? 0,
            },
            MeshExternalService: {
              ...item.resources?.MeshExternalService,
              total: item.resources?.MeshExternalService?.total ?? 0,
            },
            MeshMultiZoneService: {
              ...item.resources?.MeshMultiZoneService,
              total: item.resources?.MeshMultiZoneService?.total ?? 0,
            },
          }
          return {
            ...meshServices,
            MeshServiceGeneric: {
              total: meshServices.MeshService.total + meshServices.MeshExternalService.total + meshServices.MeshMultiZoneService.total,
            },
          }
        })(),
      } satisfies MeshInsightsResources as MeshInsightsResources,
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
