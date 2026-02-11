type PartialConnectionXdsConfig = {
  configs: unknown[]
}

const keys = [
  // dynamic_active_clusters
  'connect_timeout',
  'circuit_breakers',
  'common_http_protocol_options',

  // dynamic_listeners
  'retry_policy',
  'idle_timeout',
  'common_http_protocol_options',
  'request_headers_timeout'
]

const traverse = (item: unknown, collection: Record<string, unknown> = {}) => {
  if (typeof item !== 'object' || item === null) {
    return collection
  }

  if(Array.isArray(item)) {
    return item.map((i): unknown => traverse(i, collection))
  }

  return Object.entries(item).reduce((col, [key, value]) => {
    if (keys.includes(key)) {
      col[key] = value
    } else {
      traverse(value, collection)
    }
    return col
  }, collection)
}

const getConfig = (item: unknown): unknown => {
  if(typeof item !== 'object' || item === null) {
    return {}
  }
  if(Array.isArray(item)) {
    return item.map(i => getConfig(i)).filter(i => Object.keys(i as Record<string, unknown>).length > 0)
  }
  return Object.fromEntries(Object.entries(item).map(([key, value]) => {
    return [key, traverse(value)]
  }))
}

export const ConnectionXdsConfig = {
  fromObject: (item: unknown) => {
    console.log(getConfig(item))
    return {
      $raw: item,
      $structured: getConfig(item)
    }
  },

  fromCollection: (item: PartialConnectionXdsConfig) => {
    return {
      $raw: item,
      configs: item.configs.map(ConnectionXdsConfig.fromObject)
    }
  }
}