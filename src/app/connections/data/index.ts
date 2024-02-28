interface MetricRecord {
  [key: string]: MetricRecord | string | number
}

const protocols = ['http', 'tcp'] as const
const appProtocols = ['http2', 'grpc'] as const

type Protocols = Partial<Record<typeof protocols[number], MetricRecord>>
type AppProtocols = Partial<Record<typeof appProtocols[number], MetricRecord>>

export type Connection = {
  name: string
  service: string
  protocol: string
}
type ConnectionStats = {
  unknown?: MetricRecord
} & Protocols

type EnvoyStats = {
  cluster: ConnectionStats
  listener: ConnectionStats
}
export type TrafficEntry = {
  name: string
  protocol: keyof (Protocols & AppProtocols)
  port: string
} & AppProtocols & Protocols

// `_` followed by 1 to 5 digits followed by a `.`
const trailingPortRe = /_\d{1,5}\./

// just does the inital response to JSON parsing
export const parse = (lines: string): EnvoyStats => {
  // for each line
  const json = lines.trim().split('\n').filter((item) => {
    // only use data prefixed with any of the following
    return ['http.', 'tcp.', 'cluster.', 'listener.'].some(prop => item.startsWith(prop))
  }).reduce((prev, item) => {
    // split the `key: values` on the `:` and normalize the value
    const [key, ...value] = item.trim().split(':')
    const val = ((val) => {
      try {
        return JSON.parse(val)
      } catch (e) {
        return val
      }
    })(value.join(':').trim())

    let _key = key

    // if we are a `listener.` prefixed line we need to avoid ipv4 and ipv6
    // addresses. This turns the line into something similar to the rest i.e.
    // listener.10.244.0.11_8081.http.edge-gateway.downstream_rq_1xx to
    // listener.http.edge-gateway_8081.downstream_rq_1xx
    if (key.startsWith('listener.')) {
      if (!['.http.', '.tcp.'].some(item => key.includes(item))) {
        // if its not a http or tcp one, ignore for now
        return prev
      }

      // get rid of listener.
      let parts = key.split('.').slice(1)
      // save the _key to search on later
      _key = parts.join('.')

      // get rid of the actual end key name so we don't get a false _1xx
      parts.pop()

      // search for a port in the whats left
      const pos = parts.join('.').search(trailingPortRe)
      if (pos === -1) {
        // if we didn't find a port, ignore
        return prev
      }

      // 10.244.0.11_8081.http.edge-gateway.downstream_rq_1xx
      parts = _key.substring(pos + 1).split('.')

      // 8081.http.edge-gateway.downstream_rq_1xx
      const [port, protocol, service, name] = parts
      parts = ['listener', protocol, service.search(trailingPortRe) !== -1 ? service : `${service}_${port}`, name]
      // listener.http.edge-gateway_8081.downstream_rq_1xx
      _key = parts.join('.')
    }
    // walk the path creating `json.objects: value`
    _key.split('.').reduce((prev, item, i, arr) => {
      if (i === arr.length - 1) {
        // if this is the last segment in the path
        // then just set the value
        prev[item] = val
        return prev
      }
      // otherwise add a {} if its not there already
      // and return that as prev so we can continue appending
      if (typeof prev[item] === 'undefined') {
        const val = {}
        prev[item] = val
        return val
      } else {
        return prev[item]
      }
    }, prev)

    return prev
  }, {} as MetricRecord)

  const { http, tcp, listener = {}, cluster = {} } = json as Protocols & {
    listener: ConnectionStats
    cluster: ConnectionStats
  }

  const { ...unknown } = cluster
  return {
    cluster: {
      http,
      tcp,
      unknown,
    },
    listener,
  }
}

// lets you specify the things you are interested in
export const getTraffic = (json: ConnectionStats, filter: (key: string) => boolean): TrafficEntry[] => {
  const _protocols = [...protocols, 'unknown'] as const
  const traffic: Record<string, TrafficEntry> = {}

  _protocols.map((item) => {
    return Object.entries(json[item] || {}).filter(([key, _value]) => {
      return filter(key)
    }).forEach(([key, value]) => {
      if (typeof traffic[key] === 'undefined') {
        traffic[key] = {
          name: key,
          // TODO Cope with _8888-sdofjsdf-big-hash
          // we only get these on outbounds at the moment (and we don't need the port for the outbound)
          // so we can pretend this doesn't happen
          port: key.split('_').at(-1) ?? '',
          protocol: item === 'unknown' ? 'tcp' : item,
        }
        // on initially setting the TrafficEntry we may have guessed tcp
        // make an extra check on the stats themselves to try and figure
        // if this protocol is actually http
        // unfortunately there doesn't seem to be a way to do the same for grpc
        if (item === 'unknown') {
          const obj = value as Record<string, any>
          switch (true) {
            // use a stat that can only be non-zero for http (or gRPC)
            case obj.upstream_rq_total !== 0:
              traffic[key].protocol = 'http'
            // if we figure a way to do the same for gRPC add we can add a case here
          }
        }
        traffic[key][traffic[key].protocol] = {
          ...(traffic[key][traffic[key].protocol] || {}),
          ...value as Record<string, any>,
        }
      }
      if (item === 'unknown') {
        const obj = value as Record<string, any>
        appProtocols.forEach((protocol) => {
          if (typeof obj[protocol] !== 'undefined') {
            traffic[key].protocol = protocol
            traffic[key][protocol] = obj[protocol]
          }
        })
      }
    })
  })
  return Object.values(traffic)
}
