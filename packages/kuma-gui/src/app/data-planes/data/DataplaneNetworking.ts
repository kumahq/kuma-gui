import type {
  DataplaneGateway as PartialDataplaneGateway,
  DataplaneInbound as PartialDataplaneInbound,
  DataplaneNetworking as PartialDataplaneNetworking,
  DataplaneOutbound as PartialDataplaneOutbound,
} from '@/types/index.d'

type Connection = {
  name: string
  service: string
  protocol: string
}
export type DataplaneInbound = PartialDataplaneInbound & Connection & {
  address: string
  state: NonNullable<PartialDataplaneInbound['state']>
  addressPort: string
  serviceAddressPort: string
  listenerAddress: string
  portName: string
}
export type DataplaneOutbound = PartialDataplaneOutbound & Connection & {
}

export type DataplaneGateway = PartialDataplaneGateway & {}
export type DataplaneNetworking = Omit<PartialDataplaneNetworking, 'inbound' | 'outbound'> & {
  inboundAddress: string
  inbounds: DataplaneInbound[]
  outbounds: DataplaneOutbound[]
  type: 'sidecar' | 'gateway'
}
const DataplaneOutbound = {
  fromObject(item: PartialDataplaneOutbound): DataplaneOutbound {
    return {
      ...item,
      name: item.tags['kuma.io/service'],
      service: item.tags['kuma.io/service'],
      protocol: item.tags['kuma.io/protocol'] ?? 'tcp',
    }
  },
  fromCollection(items: PartialDataplaneOutbound[]): DataplaneOutbound[] {
    return Array.isArray(items) ? items.map(item => DataplaneOutbound.fromObject(item)) : []
  },
}
export const DataplaneNetworking = {
  fromObject(networking: PartialDataplaneNetworking): DataplaneNetworking {
    // remove singular inbound/outbound to be replaced with plural versions
    const { inbound, outbound, ...rest } = networking

    const inbounds = Array.isArray(inbound) ? inbound : []

    // outbounds are only present here on a universal DDP without transparent
    // proxying
    const outbounds = Array.isArray(outbound) ? outbound : []
    const type = typeof networking.gateway === 'undefined' || networking.gateway?.type !== 'BUILTIN' ? 'sidecar' : 'gateway'
    return {
      ...rest,
      type,
      // used for a lookup for inbounds on the result of the envoy /stats endpoint
      inboundAddress: type === 'gateway' ? networking.address : 'localhost',
      //
      // if we are a builtin gateway fill in as much as we can for a single inbound
      // we can 'clone' this later if we find out individual information for each inbound
      // i.e. this acts as a template
      inbounds: type === 'gateway' && typeof networking.gateway !== 'undefined'
        ? [{
          address: networking.address,
          tags: networking.gateway.tags,
          name: networking.gateway.tags['kuma.io/service'],
          service: networking.gateway.tags['kuma.io/service'],
          protocol: networking.gateway.tags['kuma.io/protocol'] ?? 'tcp',
          state: 'Ready',
          // these could be filled out during 'cloning'
          // i.e. these are like template variables to be filled out
          port: NaN,
          addressPort: '',
          //
          // this will never get set seeing as a gateway proxy never has a service
          serviceAddressPort: '',
          // we never set this currently as we never need it for a gateway
          listenerAddress: '',
          // not available for gateway
          portName: '',
        }]
        : inbounds.map((item) => {
          // inbound address, advertisedAddress, networkingAddress because externally accessible address
          const address = item.address ?? networking.advertisedAddress ?? networking.address
          return {
            ...item,
            // the name can be used to lookup listener envoy stats
            name: `localhost_${item.port}`,
            // the portName adds another way of referencing the port, usable with MeshService
            portName: item.name?.length ? item.name : '',
            listenerAddress: `${address}_${item.port}`,
            // If a health property is unset the inbound is considered healthy
            state: typeof item.state !== 'undefined' ? item.state : 'Ready',
            service: item.tags['kuma.io/service'],
            protocol: item.tags['kuma.io/protocol'] ?? 'tcp',
            address,
            addressPort: `${address}:${item.port}`,
            // inbound serviceAddress, inbound address, networkingAddress because the internal services accessible address
            serviceAddressPort: `${item.serviceAddress ?? address}:${item.servicePort ?? item.port}`,
          }
        }),
      outbounds: DataplaneOutbound.fromCollection(outbounds),
    }
  },
}
