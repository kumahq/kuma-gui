import { Kri } from '@/app/kuma'
import type { components } from '@kumahq/kuma-http-api'

type KumaDataplaneNetworking = NonNullable<components['schemas']['DataplaneItem']['networking']>
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
    } satisfies KumaDataplaneNetworkingLayout
  },
}

const DataplaneOutbound = {
  fromObject(item: KumaDataplaneOutbound) {
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
  fromCollection(items: KumaDataplaneOutbound[]) {
    return Array.isArray(items) ? items.map(item => DataplaneOutbound.fromObject(item)) : []
  },
}


export const DataplaneNetworking = {
  fromObject(networking: KumaDataplaneNetworking) {
    // remove singular inbound/outbound to be replaced with plural versions
    const { inbound, outbound, ...rest } = networking

    const inbounds = Array.isArray(inbound) ? inbound : []

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
      // if we are a builtin gateway fill in as much as we can for a single inbound
      // we can 'clone' this later if we find out individual information for each inbound
      // i.e. this acts as a template
      inbounds: type === 'gateway' && typeof networking.gateway !== 'undefined'
        ? ((tags = {}) => [{
          address: networking.address ?? '',
          tags,
          name: tags['kuma.io/service'] ?? '',
          service: tags['kuma.io/service'] ?? '',
          protocol: tags['kuma.io/protocol'] ?? 'tcp',
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
        }])(networking.gateway.tags)
        : inbounds.map((item) => {
          // inbound address, advertisedAddress, networkingAddress because externally accessible address
          const address = item.address ?? networking.advertisedAddress ?? networking.address ?? ''
          const name = `localhost_${item.port}`
          const tags = item.tags ?? {}
          return {
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
            service: tags['kuma.io/service'] ?? '',
            protocol: tags['kuma.io/protocol'] ?? 'tcp',
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
export type DataplaneNetworkingLayout = ReturnType<typeof DataplaneNetworkingLayout['fromObject']>
export type DataplaneOutbound = ReturnType<typeof DataplaneOutbound['fromObject']>
export type DataplaneNetworking = ReturnType<typeof DataplaneNetworking['fromObject']>
export type DataplaneInbound = DataplaneNetworking['inbounds'][number]

