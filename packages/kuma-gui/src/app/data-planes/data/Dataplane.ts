import { DataplaneNetworking } from './DataplaneNetworking'
import { Kri } from '@/app/kuma'
import type { components } from '@kumahq/kuma-http-api'

type KumaDataplane = NonNullable<components['schemas']['DataplaneItem']>

export const Dataplane = {
  fromObject(item: KumaDataplane) {
    const labels = item.labels ?? {}
    const mesh = item.mesh
    const zone = labels['kuma.io/origin'] === 'zone' && labels['kuma.io/zone'] ? labels['kuma.io/zone'] : ''
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    const name = labels['kuma.io/display-name'] ?? item.name

    return {
      ...item,
      kri: item.kri ?? Kri.toString({ shortName: 'dp', mesh, zone, namespace, name }),
      id: item.name,
      config: item,
      networking: DataplaneNetworking.fromObject(item.networking ?? {}),
    }
  },
}
export type Dataplane = ReturnType<typeof Dataplane['fromObject']>
