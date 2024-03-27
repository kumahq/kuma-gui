import type { DataSourceResponse } from '@/app/application'
import { defineSources, type Source } from '@/app/application/services/data-source'
import { Stat, ConnectionCollection } from '@/app/connections/data/'
import type KumaApi from '@/services/kuma-api/KumaApi'

export type StatsSource = DataSourceResponse<{
  inbounds: Record<string, any>
  outbounds: Record<string, any>
  passthrough: Record<string, any>
  raw: string
}>

export const sources = (source: Source, api: KumaApi) => {
  return defineSources({
    '/meshes/:mesh/dataplanes/:name/stats/:address': async (params) => {
      const { mesh, name } = params
      const res = await api.getDataplaneData({
        mesh,
        dppName: name,
        dataPath: 'stats',
      })

      const connections = ConnectionCollection.fromObject(Stat.fromCollection(res))

      // pick out the listeners/inbounds that start with our ip address (the.ip.address.1_port000)
      const inbounds = params.address === 'localhost'
        ? Object.fromEntries(Object.entries(connections.cluster).filter(([key, _value]) => key.startsWith('localhost_')))
        : Object.fromEntries(Object.entries(connections.listener).filter(([key, _value]) => key.startsWith(`${params.address}_`)))
      // pick out the outbounds which aren't internal outbounds
      const outbounds = Object.fromEntries(Object.entries(connections.cluster).filter(([key, _value]) => ![
        // if we don't exclude localhost_ we end up with  a `localhost_`
        // outbound, which is the cluster of the inbound. Whilst we don't want
        // to show this now, we might want to later as it can show how envoy
        // might be interacting with the traffic vs the cluster/service itself
        'localhost_',
        //
        '_', // most internal names will be prefixed by `_` the rest will become legacy internal names
        'admin',
        'async-client',
        'kuma_envoy_admin',
        'probe_listener',
        'inbound_passthrough_',
        'outbound_passthrough_',
        'access_log_sink',
        'ads_cluster',
        'meshtrace_zipkin',
        'meshtrace_opentelemetry',
      ].some(item => key.startsWith(item))))

      // pick out outbounds passthrough
      const passthrough = Object.fromEntries(Object.entries(connections.cluster).filter(([key, _value]) => [
        'outbound_passthrough_',
      ].some(item => key.startsWith(item))))

      return {
        passthrough,
        inbounds,
        outbounds,
        $raw: res,
        raw: res,
      }
    },
  })
}
