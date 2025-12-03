import { DataplaneNetworking } from './DataplaneNetworking'
import type { components } from '@kumahq/kuma-http-api'

type KumaDataplane = NonNullable<components['schemas']['DataplaneItem']>
type KumaDataplaneNetworking = NonNullable<components['schemas']['DataplaneItem']['networking']>

export const Dataplane = {
  fromObject(partialDataplane: KumaDataplane) {
    return {
      ...partialDataplane,
      config: partialDataplane,
      networking: DataplaneNetworking.fromObject(partialDataplane.networking as KumaDataplaneNetworking),
    }
  },
}
export type Dataplane = ReturnType<typeof Dataplane['fromObject']>
