import type { DataSourceResponse } from '@/app/application'
import { defineSources, type Source } from '@/app/application/services/data-source'
import { parse, getTraffic } from '@/app/connections/data/index'
import type { TrafficEntry } from '@/app/connections/data/index'
import type KumaApi from '@/services/kuma-api/KumaApi'

export type StatsSource = DataSourceResponse<{
  inbounds: TrafficEntry[]
  outbounds: TrafficEntry[]
  passthrough: TrafficEntry
  raw: string
}>

export const sources = (source: Source, api: KumaApi) => {
  return defineSources({
    '/meshes/:mesh/dataplanes/:name/stats/:inbound': async (params) => {
      const { mesh, name } = params
      // if the inbound name is exactly localhost, append `_` to avoid any
      // services that happen to be prefixed with `localhost`
      const inbound = params.inbound === 'localhost' ? `${params.inbound}_` : params.inbound
      const res = await api.getDataplaneData({
        mesh,
        dppName: name,
        dataPath: 'stats',
      })

      // parse the stuff
      const json = parse(res)

      // inbounds are anything starting with the `inbound` we've passed in
      // we use `~` to equal "there are no inbounds", but we might not need that
      const inbounds = inbound !== '~' ? getTraffic(inbound === 'localhost_' ? json.cluster : json.listener, (key) => key.startsWith(inbound)) : []
      // outbounds are anything else unless it starts with something in the
      // below list these are likely to follow a pattern at some point at which
      // point this list can be removed and replaced by something that exludes
      // the pattern
      const outbounds = getTraffic(json.cluster, (key) => {
        return ![
          ...(inbound !== '~' ? [inbound] : []), // removes inbounds if we've asked for them
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
        ].some(item => key.startsWith(item))
      })
      //
      // passthrough traffic is anything that starts with this list
      const passthrough = getTraffic(json.cluster, (key) => [
        'outbound_passthrough_',
      ].some(item => key.startsWith(item))).reduce((entry, item) => {
        return {
          ...entry,
          // combine/sum both http and tcp protocols of anything prefixed outbound_passthrough_
          ...(['http', 'tcp'] as const).reduce((prev, protocol) => {
            prev[protocol] = Object.entries(item[protocol] || {}).reduce((prev, [key, value]) => {
              // sum the current loop property with the previous one
              return { ...prev, [key]: (value as number) + ((prev[key] as number) ?? 0) }
            }, prev[protocol] || {})
            return prev
          }, entry),
        }
      }, {
        name: 'outbound_passthrough',
      } as TrafficEntry)

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
