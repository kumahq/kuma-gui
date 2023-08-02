import {
  Dataplane_Networking as GeneratedDataplaneNetworking,
} from '@/data/proto/mesh/v1alpha1/dataplane'
import type {
  Dataplane_Networking_Inbound as GeneratedDataplaneNetworkingInbound,
} from '@/data/proto/mesh/v1alpha1/dataplane'
export type DataplaneNetworking = GeneratedDataplaneNetworking & {
  inbound: GeneratedDataplaneNetworkingInbound[]
}
export const DataplaneNetworking = {
  fromJSON(object: any): DataplaneNetworking {
    const generated = GeneratedDataplaneNetworking.fromJSON(object)
    return {
      ...generated,
      ...{
        inbound: Array.isArray(generated.inbound) ? generated.inbound : [],
      },
    }
  },
}
