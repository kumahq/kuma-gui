const protocols = ['http', 'tcp'] as const
const appProtocols = ['http', 'tcp', 'grpc'] as const

// `_` followed by 1 to 5 digits followed by a `.`
const trailingPortRe = /_\d{1,5}\./
const trailingPortRe2 = /_\d{1,5}/
const meshServiceRe = /_(mz|m|ext){1}svc_\d{1,5}(-[a-z0-9]+)?$/

export const Stat = {
  fromCollection(items: string) {
    return parse(items)
  },
}
export const ConnectionCollection = {
  fromObject(item: Record<string, any>) {
    // look in `listener.<inbound-address_port>.<potential-protocol>.<cluster-name>.<...stats>`
    // following this we will end up with `listener.<inbound-address_port>.<definite-protocol>.<...stats>`
    const listener = typeof item.listener !== 'undefined'
      ? Object.fromEntries(
        Object.entries<any>(item.listener)
          .map(([key, value]) => {
            const { http, ...tcp } = value
            const stats = {
              tcp,
            }
            if (typeof http !== 'undefined') {
              // check http protocol for existence i.e. `listener.<inbound-socket-address | clustername>.http.<cluster-name>.<...stats>`
              // and then remove the cluster-name leaving: `listener.<inbound-address_port | clustername>.http.<...stats>`
              const cluster = Object.keys(http)[0]
              return [key, {
                ...stats,
                http: http[cluster],
                $clusterName: cluster,
                // check for grpc stats `listener.<inbound-socket-address>.http.grpc.<...stats>`
                // and un-nest if we find them `listener.<inbound-socket-address>.grpc.<...stats>`
                ...(typeof item.cluster[cluster]?.http2 !== 'undefined' ? { http2: item.cluster[cluster].http2 } : {}),
                ...(typeof item.cluster[cluster]?.grpc !== 'undefined' ? { grpc: item.cluster[cluster].grpc } : {}),
              }]
            } else {
              // if there is no `listener.<inbound-socket-address | clustername>.http`
              // just move all the stats to `.tcp` i.e. `listener.<inbound-socket-address | clustername>.tcp.<...stats>`
              return [key, {
                ...stats,
                $clusterName: '',
              }]
            }
          }),
      )
      : {}
    const cluster = typeof item.cluster !== 'undefined'
      ? Object.fromEntries(Object.entries<any>(item.cluster)
        .map(([cluster, value]) => {
          const { tcp, http, http2, grpc, ...rest } = value
          const stats = {
            $resourceMeta: {
              type: '',
              mesh: '',
              name: '',
              namespace: '',
              zone: '',
              port: '',
            },
            tcp,
            ...(typeof http !== 'undefined' ? { http } : {}),
            ...(typeof http2 !== 'undefined' ? { http2 } : {}),
            ...(typeof grpc !== 'undefined' ? { grpc } : {}),
          }
          // sniff the name to see if we are a new type of service
          const found = cluster.match(meshServiceRe)
          if (found) {
            const [mesh, name, namespace, zone, _abbr, port] = cluster.split('_')
            stats.$resourceMeta = {
              mesh,
              name,
              namespace,
              zone,
              port,
              type: ((str: string) => {
                switch (true) {
                  case (str.indexOf('_msvc_') !== -1):
                    return 'MeshService'
                  case (str.indexOf('_extsvc_') !== -1):
                    return 'MeshExternalService'
                  case (str.indexOf('_mzsvc_') !== -1):
                    return 'MeshMultiZoneService'
                }
                return ''
              })(found[0]),
            }
          }
          //
          // check each protocol for existence, on root i.e.`<protocol>.<cluster-name>`
          protocols.forEach(protocol => {
            // replaces `cluster.<cluster-name>.<protocol>` with anything in `<protocol>.<cluster-name>`
            if (typeof item[protocol]?.[cluster] !== 'undefined') {
              stats[protocol] = {
                ...stats[protocol],
                ...item[protocol][cluster],
              }
            }
          })
          // if we don't find any appProtocols (e.g. http., tcp. or .grpc) at
          // root (which is always the case for a gateway) then sniff based on
          // a http non-zero value. If we find it then add the stats to http
          // otherwise we fall back to tcp and add the stats there. This means
          // you will never get grpc protocol for an outbound on a gateway
          if (
            !appProtocols.some(protocol => typeof value[protocol] !== 'undefined') &&
            ['upstream_cx_http1_total', 'upstream_cx_http2_total', 'upstream_cx_http3_total'].some(item => Object.keys(rest).includes(item) && rest[item] !== 0)
          ) {
            stats.http = {
              ...stats.http,
              ...rest,
            }
          } else {
            stats.tcp = {
              ...stats.tcp,
              ...rest,
            }
          }
          return [cluster, stats]
        }))
      : {}

    // pick out the outbounds which aren't internal outbounds
    const withoutInternals = Object.fromEntries(Object.entries(cluster).filter(([key, _value]) => ![
      '_', // most internal names will be prefixed by `_` the rest will become legacy internal names
      'admin',
      'async-client',
      'kuma_readiness',
      'kuma_envoy_admin',
      'probe_listener',
      'access_log_sink',
      'ads_cluster',
      'meshtrace_zipkin',
      'meshtrace_opentelemetry',
    ].some(item => key.startsWith(item))))
    return {
      listener,
      cluster: withoutInternals,
    }
  },
}

// just does the initial response to JSON parsing
const parse = (lines: string): Record<string, any> => {
  // for each line
  return lines.trim().split('\n').filter((item) => {
    // only use data prefixed with any of the following
    return ['http.', 'tcp.', 'cluster.', 'listener.'].some(prop => item.startsWith(prop))
  }).map(
    (item) => {
      if (item.startsWith('listener.')) {
        const [_listener, ...rest] = item.split('.')
        const line = rest.join('.')
        const pos = line.search(trailingPortRe)
        if (pos === -1) {
          // if we didn't find a port, ignore
          return item
        }
        const ip = line.substring(0, pos).replaceAll('.', '~')
        const stat = line.substring(pos)
        return `listener.${ip}${stat}`
      }
      return item
    },
  ).reduce((prev, item) => {
    // split the `key: values` on the `:` and normalize the value
    const [key, ...value] = item.trim().split(':')
    const val = ((val) => {
      try {
        return JSON.parse(val)
      } catch {
        return val
      }
    })(value.join(':').trim())

    // walk the path creating `json.objects: value`
    key.split('.').reduce<Record<string, any>>((prev, item, i, arr) => {
      // put the dots back
      if (trailingPortRe2.test(item)) {
        item = item.replaceAll('~', '.')
      }
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
        return prev[item] as Record<string, any>
      }
    }, prev)
    return prev
  }, {})
}
