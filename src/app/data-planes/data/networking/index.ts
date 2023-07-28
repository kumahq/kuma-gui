import type {
  DataplaneNetworking as OriginalDataplaneNetworking,
  DataplaneNetworkingInbound as OriginalDataplaneNetworkingInbound,
  DataplaneNetworkingInboundHealth as OriginalDataplaneNetworkingInboundHealth,
} from './original'
export type DataplaneNetworkingInboundHealth = OriginalDataplaneNetworkingInboundHealth & {

}
export type DataplaneNetworkingInbound = OriginalDataplaneNetworkingInbound & {
  health: DataplaneNetworkingInboundHealth
}
export type DataplaneNetworking = OriginalDataplaneNetworking & {
  inbound: DataplaneNetworkingInbound[]
}
export const DataplaneNetworking = {
  fromJSON(object: unknown): DataplaneNetworking {
    const generated = {
      ...(object as OriginalDataplaneNetworking),
    }
    return {
      ...generated,
      ...{
        inbound: Array.isArray(generated.inbound) ? generated.inbound.map((item: any) => DataplaneNetworkingInbound.fromJSON(item || {})) : [],
      },
    }
  },
}
export const DataplaneNetworkingInbound = {
  fromJSON(object: any): DataplaneNetworkingInbound {
    return {
      ...object,
      // an undefined health means we don't know either way
      // health: DataplaneNetworkingInboundHealth.fromJSON(object.health || {}),
    }
  },
}
export const DataplaneNetworkingInboundHealth = {
  fromJSON(object: any): DataplaneNetworkingInboundHealth {
    return { ready: isSet(object.ready) ? Boolean(object.ready) : false }
  },
}
function isSet(value: any): boolean {
  return value !== null && value !== undefined
}
