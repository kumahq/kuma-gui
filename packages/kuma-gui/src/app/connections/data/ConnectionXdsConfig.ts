import merge from 'deepmerge'

type PartialConnectionXdsConfigs = {
  configs?: unknown[]
}

export const policyAffectedKeys = [
  // meshaccesslog
  'tcp_proxy',
  'rbac',
  'grpc_stats_access_log_config',
  'access_loggers',
  // meshcircuitbreaker
  'circuit_breakers',
  // meshfaultinjection
  'fault',
  // meshhealthcheck
  'health_checks',
  // meshhttproute
  'routes',
  // meshloadbalancingstrategy
  'lb_policy',
  'lb_config',
  'lb_subset_config',
  'hash_policy',
  'locality_lb_endpoints',
  // meshmetric
  'grpc_stats_access_log_config',
  'access_loggers',
  // meshpassthrough
  'tcp_proxy',
  'HttpConnectionManager',
  // meshproxypatch: can change any config
  // meshratelimit
  'local_ratelimit',
  'typed_per_filter_config',
  'max_tokens',
  'tokens_per_fill',
  'fill_interval',
  // meshretry
  'retry_policy',
  // meshtcproute
  'weighted_clusters',
  // meshtimeout
  'connect_timeout',
  'idle_timeout',
  'stream_idle_timeout',
  'max_stream_duration',
  'max_grpc_timeout',
  'request_headers_timeout',
  'max_connection_duration',
  // meshtls
  'tls',
  'tls_certificate',
  'validation_context',
  // meshtrace
  'tracing',
  'tracers',
  'trace_context_propagation',
  // meshtrafficpermission
  'rbac',
  'transport_socket'
]

export const ConnectionXdsConfig = {
  /**
   * Traverses a given tree and filters out only the specified keys,
   * while preserving the original structure of the tree.
   */
  toConcise: (item: unknown, keys: string[]) => {
    /**
     * Tracks all the elements found by their keys nested in their subtree.
     */
    const results: Record<string, unknown>[] = []

    /**
     * Traverses the tree recursively, and whenever it finds a key that matches the specified keys,
     * it reconstructs the path from the root to that key and stores it in the results array.
     */
    const traverse = (tree: unknown, path: { key: string, type: 'array' | 'object' }[] = []) => {
      if(typeof tree === 'object' && tree !== null) {
        if(Array.isArray(tree)) {
          tree.forEach((i) => traverse(i, path))
        } else {
          const subTree = tree as Record<string, unknown>
          Object.entries(subTree).forEach(([key, value]) => {
            if (keys.includes(key)) {
              // rebuilds the subtree to the found element bottom up
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
      /**
       * When merging arrays, we want to merge items with the same keys instead of concatenating them.
       * Items that don't have matching keys will be concatenated as usual.
       * This way we preserve the original structure of the tree.
       */
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

  fromCollection: (item: PartialConnectionXdsConfigs) => {
    return {
      ...item,
      $raw: item,
      $concise: ConnectionXdsConfig.toConcise(item, policyAffectedKeys),
    }
  }
}
