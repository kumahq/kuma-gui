const protocols = ['http', 'tcp'] as const
const appProtocols = ['http', 'tcp', 'grpc'] as const

export const Stat = {
  fromCollection(items: string) {
    return parse(items)
  },
}
export const ConnectionCollection = {
  fromObject(item: Record<string, any>) {
    // look in `listener.<inbound-address_port>.<potential-protocol>.<cluster-name>.<...stats>`
    const inbounds = typeof item.listener !== 'undefined'
      ? Object.fromEntries(
        Object.entries<any>(item.listener)
          .filter(
            // only use if we find a protocol on `listener.<inbound-socket-address>.<potential-protocol>`
            ([_key, value]) => protocols.some(protocol => protocol in value),
          )
          .map(([key, value]) => {
            // check each protocol for existence, including the appProtocol `grpc`:
            // `listener.<inbound-socket-address>.http.<cluster-name>.grpc.<...stats>`
            // and then remove the cluster-name leaving:
            // `listener.<inbound-address_port>.<protocol>.<...stats>`
            protocols.forEach((protocol) => {
              if (typeof value[protocol] !== 'undefined') {
                const cluster = Object.keys(value[protocol])[0]
                // look at cluster<cluster-name>.grpc to see if it exists
                // if so we are a gRPC inbound
                if (typeof item.cluster[cluster]?.grpc !== 'undefined') {
                  value.grpc = item.cluster[cluster].grpc
                }
                value[protocol] = value[protocol][cluster]
              }
            })
            return [key, value]
          }),
      )
      : {}

    const outbounds = typeof item.cluster !== 'undefined'
      ? Object.fromEntries(Object.entries<any>(item.cluster)
        .map(([cluster, value]) => {
          // check each protocol for existence, on root i.e.`<protocol>.<cluster-name>`
          protocols.forEach(protocol => {
            // replaces `cluster.<cluster-name>.<protocol>` with anything in `<protocol>.<cluster-name>`
            if (typeof item[protocol]?.[cluster] !== 'undefined') {
              value[protocol] = {
                ...value[protocol],
                ...item[protocol][cluster],
                ...value,
              }
            }
          })
          // if we don't find any appProtocols (e.g. http., tcp. or .grpc) which is always the case for a gateway
          // then sniff based on a http non-zero value, falling back to tcp
          // this means you will never get grpc protocol for an outbound on a gateway
          if (!appProtocols.some(protocol => typeof value[protocol] !== 'undefined')) {
            const protocol = (Object.keys(value).includes('upstream_rq_total') && value.upstream_rq_total !== 0) ? 'http' : 'tcp'
            value[protocol] = value
          }
          return [cluster, value]
        }))
      : {}

    return {
      inbounds,
      outbounds,
    }
  },
}

// `_` followed by 1 to 5 digits followed by a `.`
const trailingPortRe = /_\d{1,5}\./
const trailingPortRe2 = /_\d{1,5}/

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
      } catch (e) {
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
