import { Kri } from '@/app/kuma'
import type { components } from '@kumahq/kuma-http-api'

type KumaDataplaneNetworking = NonNullable<components['schemas']['DataplaneItem']['networking']>
type KumaDataplaneInbound = NonNullable<NonNullable<NonNullable<components['schemas']['DataplaneOverviewWithMeta']['dataplane']>['networking']>['inbound']>[number]
type KumaDataplaneListener = NonNullable<NonNullable<NonNullable<components['schemas']['DataplaneOverviewWithMeta']['dataplane']>['networking']>['listeners']>[number]
type KumaDataplaneOutbound = NonNullable<NonNullable<NonNullable<components['schemas']['DataplaneOverviewWithMeta']['dataplane']>['networking']>['outbound']>[number]
type KumaDataplaneNetworkingLayout = components['schemas']['DataplaneNetworkingLayout']

export const DataplaneNetworkingLayout = {
  fromObject(dataplaneNetworkingLayout: KumaDataplaneNetworkingLayout) {
    // `stat_prefix` corresponds to the stat_prefix used in the Envoy stats.
    // proxyResourceName.sectionName can either be a portName or port, so we
    // make sure its always the port as this is what the Envoy stat_prefix
    // uses. Once the following issue is resolved we won't have to do this
    // https://github.com/kumahq/kuma/issues/14469
    return {
      ...dataplaneNetworkingLayout,
      spiffeId: dataplaneNetworkingLayout.spiffeId ?? '',
      // don't show a card for anything on port 49151 as those are service-less inbounds
      // we currently only do this on the layout endpoint
      inbounds: dataplaneNetworkingLayout.inbounds.filter(item => item.port !== 49151).map(item => {
        const kri = Kri.fromString(item.kri)
        return {
          ...item,
          type: '',
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
      listeners: dataplaneNetworkingLayout.listeners.map(item => {
        const kri = Kri.fromString(item.kri)
        return {
          ...item,
          // protocol of ZoneIngress listeners is always tcp, for ZoneEgress it depends and therefore it's not set
          protocol: item.type === 'ZoneIngress' ? 'tcp' : '',
          stat_prefix: item.proxyResourceName,
          portName: kri.sectionName !== String(item.port) ? kri.sectionName : undefined,
        }
      }),
    } satisfies KumaDataplaneNetworkingLayout
  },
}

const DataplaneListener = {
  fromObject(item: KumaDataplaneListener) {
    const name = item.name ?? ''
    const address = item.address ?? ''
    return {
      tags: {} as Record<string, string>,
      socketAddress: '',
      listenerAddress: '',
      clusterName: '',
      serviceAddressPort: '',
      //
      ...item,
      name,
      address,
      port: item.port ?? NaN,
      state: typeof item.state !== 'undefined' ? String(item.state) : 'Ready',
      addressPort: `${address}:${item.port}`,
      protocol: item.type === 'ZoneIngress' ? 'tcp' : '',
      portName: name,
      type: String(item.type ?? ''),
    }
  },
  fromCollection(items: KumaDataplaneListener[] = []) {
    return Array.isArray(items) ? items.map(item => DataplaneListener.fromObject(item)) : []
  },
}

const DataplaneOutbound = {
  fromObject(item: KumaDataplaneOutbound) {
    const address = item.address ?? '127.0.0.1'
    const tags = item.tags ?? {}
    return {
      ...item,
      tags,
      // @TODO how do we get the name of the outbound?
      name: tags['kuma.io/service'] ?? '',
      protocol: tags['kuma.io/protocol'] ?? 'tcp',
      address,
      addressPort: `${address}${typeof item.port === 'number' ? `:${item.port}` : ''}`,
    }
  },
  fromCollection(items: KumaDataplaneOutbound[]) {
    return Array.isArray(items) ? items.map(item => DataplaneOutbound.fromObject(item)) : []
  },
}

const GatewayDataplaneInbound = {
  fromObject(networking: KumaDataplaneNetworking) {
    // if we are a builtin gateway fill in as much as we can for a single inbound
    // we can 'clone' this later if we find out individual information for each inbound
    // i.e. this acts as a template
    return {
      type: '',
      address: networking.address ?? '',
      tags: networking.gateway?.tags ?? {},
      name: '',
      protocol: '',
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
    }
  },
}

const DataplaneInbound = {
  fromObject(item: KumaDataplaneInbound, networking: KumaDataplaneNetworking) {
    // inbound address, advertisedAddress, networkingAddress because externally accessible address
    const address = item.address ?? networking.advertisedAddress ?? networking.address ?? ''
    const name = `localhost_${item.port}`
    const tags = item.tags ?? {}
    return {
      type: '',
      //
      ...item,
      tags,
      // the name can be used to lookup listener envoy stats
      name,
      port: Number(item.port),
      // the portName adds another way of referencing the port, usable with MeshService
      portName: item.name?.length ? item.name : '',
      socketAddress: `${address}_${item.port}`,
      listenerAddress: `${address}_${item.port}`,
      clusterName: item.servicePort && item.servicePort !== item.port ? `localhost_${item.servicePort}` : name,
      // If a health property is unset the inbound is considered healthy
      state: (typeof item.state !== 'undefined' ? String(item.state) : 'Ready'),
      protocol: item.protocol ?? tags['kuma.io/protocol'] ?? 'tcp',
      address,
      addressPort: `${address}:${item.port}`,
      // inbound serviceAddress, inbound address, networkingAddress because the internal services accessible address
      serviceAddressPort: `${item.serviceAddress ?? address}:${item.servicePort ?? item.port}`,
    }
  },
}

export const DataplaneNetworking = {
  fromObject(networking: KumaDataplaneNetworking) {
    // remove singular inbound/outbound to be replaced with plural versions
    const { inbound, outbound, ...rest } = networking

    const inbounds = Array.isArray(inbound) ? inbound : []
    const listeners = Array.isArray(networking.listeners) ? networking.listeners : []

    // outbounds are only present here on a universal DDP without transparent
    // proxying
    const outbounds = Array.isArray(outbound) ? outbound : []
    const type = typeof networking.gateway === 'undefined' || networking.gateway?.type !== 'BUILTIN' ? 'sidecar' : 'gateway'

    return {
      ...rest,
      ...(networking.gateway ? {
        gateway: {
          ...networking.gateway,
          tags: networking.gateway.tags ?? {},
        },
      } : {}),
      type: type as 'sidecar' | 'gateway',
      // used for a lookup for inbounds on the result of the envoy /stats endpoint
      inboundAddress: type === 'gateway' ? networking.address ?? 'localhost' : 'localhost',
      //
      inbounds: (() => {
        switch(true) {
          case type === 'gateway' && typeof networking.gateway !== 'undefined': {
            return [GatewayDataplaneInbound.fromObject(networking)]
          }
          default:
            return [
              ...inbounds.map(item => DataplaneInbound.fromObject(item, networking)),
              ...DataplaneListener.fromCollection(listeners) ?? [],
            ]
        }
      })() satisfies GenericDataplaneInbound[],
      outbounds: DataplaneOutbound.fromCollection(outbounds),
    }
  },
}
export type DataplaneNetworkingLayout = ReturnType<typeof DataplaneNetworkingLayout['fromObject']>
export type DataplaneOutbound = ReturnType<typeof DataplaneOutbound['fromObject']>
export type DataplaneNetworking = ReturnType<typeof DataplaneNetworking['fromObject']>
export type DataplaneInbound = ReturnType<typeof DataplaneInbound['fromObject']>
export type DataplaneListener = ReturnType<typeof DataplaneListener['fromObject']>
export type GatewayDataplaneInbound = ReturnType<typeof GatewayDataplaneInbound['fromObject']>
export type GenericDataplaneInbound = DataplaneInbound & DataplaneListener & GatewayDataplaneInbound
