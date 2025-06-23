import type { DataSourceResponse } from '@/app/application'
import { defineSources } from '@/app/application/services/data-source'
import { Stat, ConnectionCollection } from '@/app/connections/data/'
import type KumaApi from '@/app/kuma/services/kuma-api/KumaApi'

export type StatsSource = DataSourceResponse<{
  inbounds: Record<string, any>
  outbounds: Record<string, any>
  passthrough: Record<string, any>
  raw: string
}>

const prop = <K extends PropertyKey>(obj: unknown, key: K | null | undefined): obj is Record<K, unknown> => {
  return key != null && obj != null && typeof obj === 'object' && key in obj
}
const filter = (data: Record<string, unknown>, cb: (key: string, arr: unknown[]) => unknown[]) => {
  const { configs } = data
  if (!Array.isArray(configs)) {
    return { configs: [] }
  }
  return {
    configs: configs.reduce((prev, item) => {
      const entries = Object.entries(item)

      const found = entries.reduce((prev, [key, value]) => {
        const found = cb(key, Array.isArray(value) ? value : [])
        if (found.length > 0) {
          if (typeof prev[key] === 'undefined') {
            prev[key] = []
          }
          prev[key] = prev[key].concat(found)
        }
        return prev
      }, {} as typeof configs[number])

      if (Object.keys(found).length > 0) {
        return prev.concat(found)
      }
      return prev

    }, [] as typeof configs),
  }
}
export const sources = (api: KumaApi) => {
  return defineSources({
    '/connections/stats/for/:proxyType/:name/:mesh/:socketAddress': async (params) => {
      const { name, mesh, socketAddress, proxyType } = params

      const res = await (() => {
        switch (proxyType) {
          case 'dataplane':
            return api.getDataplaneStats({
              mesh,
              dppName: name,
            })
          case 'zone-ingress':
            return api.getZoneIngressStats({
              name,
            })
          case 'zone-egress':
            return api.getZoneEgressStats({
              name,
            })
          default:
            throw new Error('incorrect value for proxyType')
        }
      })()
      const connections = ConnectionCollection.fromObject(Stat.fromCollection(res))

      let inbounds, outbounds, passthrough
      if (proxyType === 'dataplane') {
        // pick out the listeners/inbounds that start with our ip address (the.ip.address.1_port000)
        inbounds = params.socketAddress === 'localhost'
          ? Object.fromEntries(Object.entries(connections.cluster).filter(([key, _value]) => key.startsWith('localhost_')))
          : Object.fromEntries(Object.entries(connections.listener).filter(([key, value]) => key.startsWith(`${params.socketAddress}_`) && !value.$clusterName.startsWith('_')))

        outbounds = Object.fromEntries(Object.entries(connections.cluster).filter(([key, _value]) => ![
          // if we don't exclude localhost_ we end up with  a `localhost_`
          // outbound, which is the cluster of the inbound. Whilst we don't want
          // to show this now, we might want to later as it can show how envoy
          // might be interacting with the traffic vs the cluster/service itself
          'localhost_',
          'inbound_passthrough_',
          'outbound_passthrough_',
        ].some(item => key.startsWith(item))))

        // pick out outbounds passthrough
        passthrough = Object.fromEntries(Object.entries(connections.cluster).filter(([key, _value]) => [
          'outbound_passthrough_',
        ].some(item => key.startsWith(item))))

      } else {
        inbounds = Object.fromEntries(Object.entries(connections.listener).filter(([key, _value]) => key.startsWith(socketAddress.replace(':', '_'))))
        outbounds = connections.cluster
        passthrough = {}
      }

      return {
        passthrough,
        inbounds,
        outbounds,
        $raw: res,
        raw: res,
      }
    },

    '/connections/clusters/for/:proxyType/:name/:mesh': async (params) => {
      const { name, mesh, proxyType } = params
      const res = await (() => {
        switch (proxyType) {
          case 'dataplane':
            return api.getDataplaneClusters({
              mesh,
              dppName: name,
            })
          case 'zone-ingress':
            return api.getZoneIngressClusters({
              name,
            })
          case 'zone-egress':
            return api.getZoneEgressClusters({
              name,
            })
          default:
            throw new Error('incorrect value for proxyType')
        }
      })()
      return res
    },
    '/connections/xds/for/:proxyType/:name/:mesh/:endpoints': async (params) => {
      const { mesh, name, endpoints, proxyType } = params
      const res = await (() => {
        switch (proxyType) {
          case 'dataplane':
            return api.getDataplaneXds({
              mesh,
              dppName: name,
            }, {
              include_eds: endpoints,
            })
          case 'zone-ingress':
            return api.getZoneIngressXds({
              name,
            }, {
              include_eds: endpoints,
            })
          case 'zone-egress':
            return api.getZoneEgressXds({
              name,
            }, {
              include_eds: endpoints,
            })
          default:
            throw new Error('incorrect value for proxyType')
        }
      })()
      return res
    },

    '/connections/xds/for/:proxyType/:name/:mesh/outbound/:outbound/endpoints/:endpoints': async (params) => {
      const { name, mesh, outbound, endpoints, proxyType } = params

      const res = await (() => {
        switch (proxyType) {
          case 'dataplane':
            return api.getDataplaneXds({
              mesh,
              dppName: name,
            }, {
              include_eds: endpoints,
            })
          case 'zone-ingress':
            return api.getZoneIngressXds({
              name,
            }, {
              include_eds: endpoints,
            })
          case 'zone-egress':
            return api.getZoneEgressXds({
              name,
            }, {
              include_eds: endpoints,
            })
          default:
            throw new Error('incorrect value for proxyType')
        }
      })()

      return filter(res, (key: string, arr: unknown[]) => {
        switch (key) {
          case 'dynamic_listeners':
            // this one won't work yet see
            // https://github.com/kumahq/kuma/issues/12093
            // dynamic_listeners[].name === 'outbound:<outbound>'
            return arr.filter(item => prop(item, 'name') && item.name === `outbound:${outbound}`)
          case 'dynamic_active_clusters':
            // dynamic_active_clusters[].cluster.name === outbound
            return arr.filter(item => prop(item, 'cluster') && prop(item.cluster, 'name') && item.cluster?.name === outbound)
          case 'dynamic_endpoint_configs':
            // dynamic_endpoint_configs[].endpoint_config.cluster_name === outbound
            return arr.filter(item => prop(item, 'endpoint_config') && prop(item.endpoint_config, 'cluster_name') && item.endpoint_config?.cluster_name === outbound)
        }
        return []
      })
    },
    '/connections/xds/for/:proxyType/:name/:mesh/inbound/:inbound': async (params) => {
      const { name, mesh, inbound, proxyType } = params

      // we don't ask for endpoints because we don't need them for inbound filtering
      const res = await (() => {
        switch (proxyType) {
          case 'dataplane':
            return api.getDataplaneXds({
              mesh,
              dppName: name,
            }, {
              include_eds: false,
            })
          case 'zone-ingress':
            return api.getZoneIngressXds({
              name,
            }, {
              include_eds: false,
            })
          case 'zone-egress':
            return api.getZoneEgressXds({
              name,
            }, {
              include_eds: false,
            })
          default:
            throw new Error('incorrect value for proxyType')
        }
      })()

      return filter(res, (key: string, arr: unknown[]) => {
        switch (key) {
          case 'dynamic_listeners':
            // dynamic_listeners[].name === 'inbound:<ignored>:0000'
            return arr.filter((item = {}) => prop(item, 'name') && typeof item.name === 'string' && item.name.startsWith('inbound:') && item.name?.endsWith(`:${inbound}`))
          case 'dynamic_active_clusters':
            // dynamic_active_clusters[].cluster.name === '<ignored>:0000'
            return arr.filter(item => prop(item, 'cluster') && prop(item.cluster, 'name') && typeof item.cluster.name === 'string' && item.cluster?.name?.endsWith(`:${inbound}`))
        }
        return []
      })
    },
  })
}
