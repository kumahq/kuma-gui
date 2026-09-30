import type { paths } from '@kumahq/kuma-http-api'

type KumaGlobalInsight = paths['/global-insight']['get']['responses']['200']['content']['application/json']

export const GlobalInsight = {
  fromObject(item: KumaGlobalInsight) {
    return {
      ...item,
      dataplanes: {
        ...item.dataplanes,
        ...('standard' in item.dataplanes ? item.dataplanes.standard as Omit<typeof item.dataplanes, 'standard'> : {}),
      },
      resources: (() => {
        const resources = {
          ...item.resources,
          MeshService: {
            ...item.resources.MeshService,
            total: item.resources.MeshService?.total ?? 0,
          },
          MeshMultiZoneService: {
            ...item.resources.MeshMultiZoneService,
            total: item.resources.MeshMultiZoneService?.total ?? 0,
          },
          MeshExternalService: {
            ...item.resources.MeshExternalService,
            total: item.resources.MeshExternalService?.total ?? 0,
          },
        }
        return resources as KumaGlobalInsight['resources'] & typeof resources
      })(),
    }
  },
}

export type GlobalInsight = ReturnType<typeof GlobalInsight.fromObject>
