import { Kri } from '@/app/kuma'
import type {
  DataplaneGateway as PartialDataplaneGateway,
  DataplaneInbound as PartialDataplaneInbound,
  DataplaneNetworking as PartialDataplaneNetworking,
} from '@/types/index.d'
import type { components } from '@kumahq/kuma-http-api'


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
  socketAddress: string
  listenerAddress: string
  portName: string
  clusterName: string
}
type PartialDataplaneOutbound = NonNullable<NonNullable<NonNullable<components['schemas']['DataplaneOverviewWithMeta']['dataplane']>['networking']>['outbound']>[number]

export type DataplaneGateway = PartialDataplaneGateway & {}

type PartialDataplaneNetworkingLayout = components['schemas']['DataplaneNetworkingLayout']

export const DataplaneNetworkingLayout = {
  fromObject(dataplaneNetworkingLayout: PartialDataplaneNetworkingLayout) {
    // `stat_prefix` corresponds to the stat_prefix used in the Envoy stats.
    // proxyResourceName.sectionName can either be a portName or port, so we
    // make sure its always the port as this is what the Envoy stat_prefix
    // uses. Once the following issue is resolved we won't have to do this
    // https://github.com/kumahq/kuma/issues/14469
    return {
      ...dataplaneNetworkingLayout,
      // don't show a card for anything on port 49151 as those are service-less inbounds
      // we currently only do this on the layout endpoint
      inbounds: dataplaneNetworkingLayout.inbounds.filter(item => item.port !== 49151).map(item => {
        const kri = Kri.fromString(item.kri)
        return {
          ...item,
          stat_prefix: item.proxyResourceName,
          portName: kri.sectionName !== String(item.port) ? kri.sectionName : undefined,
        }
      }),
      outbounds: dataplaneNetworkingLayout.outbounds.map(item => {
        const kri = Kri.fromString(item.kri)
        return {
          ...item,
          stat_prefix: item.proxyResourceName,
          portName: kri.sectionName !== String(item.port) ? kri.sectionName : undefined,
        }
      }),
    } satisfies PartialDataplaneNetworkingLayout
  },
}
export type DataplaneNetworkingLayout = ReturnType<typeof DataplaneNetworkingLayout.fromObject>

const DataplaneOutbound = {
  fromObject(item: PartialDataplaneOutbound) {
    const address = item.address ?? '127.0.0.1'
    const tags = item.tags ?? {}
    return {
      ...item,
      tags,
      name: tags['kuma.io/service'],
      service: tags['kuma.io/service'],
      protocol: tags['kuma.io/protocol'] ?? 'tcp',
      address,
      addressPort: `${address}${typeof item.port === 'number' ? `:${item.port}` : ''}`,
    }
  },
  fromCollection(items: PartialDataplaneOutbound[]) {
    return Array.isArray(items) ? items.map(item => DataplaneOutbound.fromObject(item)) : []
  },
}
export type DataplaneOutbound = ReturnType<typeof DataplaneOutbound.fromObject>

export type DataplaneNetworking = Omit<PartialDataplaneNetworking, 'inbound' | 'outbound'> & {
  inboundAddress: string
  inbounds: DataplaneInbound[]
  outbounds: DataplaneOutbound[]
  type: 'sidecar' | 'gateway'
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
          socketAddress: '',
          listenerAddress: '',
          // not available for gateway
          portName: '',
          clusterName: '',
        }]
        : inbounds.map((item) => {
          // inbound address, advertisedAddress, networkingAddress because externally accessible address
          const address = item.address ?? networking.advertisedAddress ?? networking.address
          const name = `localhost_${item.port}`
          return {
            ...item,
            // the name can be used to lookup listener envoy stats
            name,
            // the portName adds another way of referencing the port, usable with MeshService
            portName: item.name?.length ? item.name : '',
            socketAddress: `${address}_${item.port}`,
            listenerAddress: `${address}_${item.port}`,
            clusterName: item.servicePort && item.servicePort !== item.port ? `localhost_${item.servicePort}` : name,
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
