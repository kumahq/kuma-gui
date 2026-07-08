import { DataplaneNetworking } from './DataplaneNetworking'
import { Kri } from '@/app/kuma'
import type { components } from '@kumahq/kuma-http-api'

export type KumaDataplane = NonNullable<components['schemas']['DataplaneItem']>
type KumaDataplaneNetworking = NonNullable<components['schemas']['DataplaneItem']['networking']>

export const Dataplane = {
  fromObject(partialDataplane: KumaDataplane) {
    const labels = partialDataplane.labels ?? {}
    const mesh = partialDataplane.mesh
    const zone = labels['kuma.io/origin'] === 'zone' && labels['kuma.io/zone'] ? labels['kuma.io/zone'] : ''
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    const name = labels['kuma.io/display-name'] ?? partialDataplane.name
    
    return {
      ...partialDataplane,
      kri: partialDataplane.kri ?? Kri.toString({ shortName: 'dp', mesh, zone, namespace, name }),
      id: partialDataplane.name,
      config: partialDataplane,
      networking: DataplaneNetworking.fromObject(partialDataplane.networking as KumaDataplaneNetworking),
    }
  },
}
export type Dataplane = ReturnType<typeof Dataplane['fromObject']>
