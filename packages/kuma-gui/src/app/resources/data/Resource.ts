/**
 * Filters should follow the rules of [kong-aip#160](https://kong-aip.netlify.app/aip/160/).
 * 
 * `filters` are the current defaults, but may not necessarily be used depending on the actual requirements of an API.
 */
const filters = {
  namespace: 'filter[labels.k8s.kuma.io/namespace]',
  zone: 'filter[labels.kuma.io/zone]',
}

type SearchOptions = {
  defaultKey?: string
}

type ValidateFilterQueryOptions = {
  allowedFilters?: string[]
}

const isShortFilter = (k: string): k is keyof typeof filters => k in filters

export const Resource = {
  search(query: string, options: SearchOptions = {}) {
    const { defaultKey = 'name' } = options
    const parts = query.trim().split(/\s+/)

    return parts.reduce((acc, curr) => {
      const [key, value] = curr.split(/:(.*)/)
      
      switch(true) {
        case Boolean(value): {
          const _key = isShortFilter(key) ? filters[key] : key
          return {
            ...acc,
            [_key]: value,
          }
        }
        case curr.includes(':') || (!key && !value):
          // at this point this would be an invalid query, i.e. `name:`
          return acc
        default:
          return {
            ...acc,
            [defaultKey]: key,
          }
      }
    }, {} as Record<string, string>)
  },

  validateFilterQuery(query: string, options: ValidateFilterQueryOptions = {}) {
    const { allowedFilters = [] } = options
    const chunks = query.split(/\s+/g)
    
    return chunks.map((chunk) => {
      const [key, value] = chunk.split(/:(.*)/)
      const filter = {
        raw: chunk,
        key,
        value,
      }

      switch(true) {
        case key && !value?.length:
          return {
            ...filter,
            message: 'filter.missing-value',
          }
        case key && value && !allowedFilters.includes(key):
          return {
            ...filter,
            message: 'filter.invalid-key',
          }
        default:
          return null
      }
    }).filter((filter) => !!filter)
  },
}
