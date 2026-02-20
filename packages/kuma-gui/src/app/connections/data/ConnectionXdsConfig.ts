import merge from 'deepmerge'

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

export const ConnectionXdsConfig = {
  toConcise: (item: unknown) => {
    const results: Record<string, unknown>[] = []
    const traverse = (tree: unknown, path: { key: string, type: 'array' | 'object' }[] = []) => {
      if(typeof tree === 'object' && tree !== null) {
        if(Array.isArray(tree)) {
          for(const i of tree) {
            traverse(i, path)
          }
        } else {
          const subTree = tree as Record<string, unknown>
          Object.entries(subTree).forEach(([key, value]) => {
            if (keys.includes(key)) {
              const found = path.toReversed().reduce((acc, curr) => {
                return {
                  [curr.key]: curr.type === 'array' ? [acc] : acc
                }
              }, { [key]: value })
              results.push(found)
            } else {
              const currentPath = [...path, { key, type: Array.isArray(value) ? 'array' as const : 'object' as const }]
              traverse(value, currentPath)
            }
          })
        }
      }
    }

    traverse(item)

    return merge.all(results, { 
      arrayMerge: (target, source, options) => {
        const destination = target.slice()
        
        if (destination.length === 0 || source.length === 0) {
          return [...destination, ...source]
        }
        
        const mergedItems = new Map()
        
        destination.forEach(item => {
          Object.keys(item).forEach((key) => {
            mergedItems.set(key, item)
          })
        })
        source.forEach((item) => {
          Object.keys(item).forEach((key) => {
            if(mergedItems.has(key)) {
              mergedItems.set(key, merge(mergedItems.get(key), item, options))
            } else {
              mergedItems.set(key, item)
            }
          })
        })
        
        return Array.from(mergedItems.values())
      }
    })
  },

  fromCollection: (item: PartialConnectionXdsConfig) => {
    return {
      $raw: item,
      $concise: ConnectionXdsConfig.toConcise(item),
      configs: item.configs
    }
  }
}
