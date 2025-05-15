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

const isShortFilter = (k: string): k is keyof typeof filters => k in filters

export const Resource = {
  search(query: string, options: SearchOptions = {}) {
    const { defaultKey = 'name' } = options
    const parts = query.trim().split(/\s+/)

    return parts.reduce((acc, curr) => {
      const [key, value] = curr.split(/:(.*)/)
      
      switch(true) {
        case key?.length && value?.length && !isShortFilter(key):
          return {
            ...acc,
            [`filter[labels.${key}]`]: value,
          }
        case !!value?.length: {
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
}
