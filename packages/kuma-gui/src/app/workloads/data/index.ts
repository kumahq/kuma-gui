import { Kri } from '@/app/kuma'
import { Resource } from '@/app/resources/data/Resource'
import type { components } from '@kumahq/kuma-http-api'

export type KumaWorkloadItem = components['schemas']['WorkloadItem']
export type KumaWorkloadCollection = components['responses']['WorkloadList']['content']['application/json']

export const Workload = {
  search(query: string) {
    return Resource.search(query)
  },
  
  fromObject: (workload: KumaWorkloadItem) => {
    const name = workload.labels?.['kuma.io/display-name'] ?? workload.name
    const namespace = workload.labels?.['k8s.kuma.io/namespace'] ?? ''
    const zone = workload.labels?.['kuma.io/zone'] ?? ''
    const mesh = workload.mesh ?? workload.labels?.['kuma.io/mesh'] ?? ''
    const { total = 0, connected = 0, healthy = 0 } = workload.status?.dataplaneProxies ?? {}

    return {
      ...workload,
      id: workload.name,
      kri: workload.kri ?? Kri.toString({ shortName: 'wl', mesh, zone, namespace, name }),
      labels: workload.labels ?? {},
      name,
      namespace,
      zone,
      mesh,
      status: {
        ...workload.status,
        state: (() => {
          switch(true) {
            case total > 0 && total === healthy && total === connected:
              return 'online' as const
            case total > 0 && (total !== connected || total !== healthy):
              return 'partially_degraded' as const
            case total === 0:
              return 'disabled' as const
            default:
              return 'offline' as const
          }
        })(),
        dataplaneProxies: {
          ...workload.status?.dataplaneProxies,
          total,
          connected,
          healthy,
        },
      },
      $raw: workload,
    }
  },

  fromCollection: (collection: KumaWorkloadCollection) => {
    return {
      ...collection,
      total: collection.total ?? collection.items?.length ?? 0,
      items: collection.items?.map(Workload.fromObject) ?? [],
    }
  },
}

export type WorkloadItem = ReturnType<typeof Workload.fromObject>
export type WorkloadCollection = ReturnType<typeof Workload.fromCollection>
