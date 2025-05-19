/**
 * Filters should follow the rules of [kong-aip#160](https://kong-aip.netlify.app/aip/160/).
 * 
 * `filters` are the current defaults, but may not necessarily be used depending on the actual requirements of an API.
 */
const filters = {
  namespace: 'filter[labels.k8s.kuma.io/namespace]',
  zone: 'filter[labels.kuma.io/zone]',
  service: 'filter[labels.kuma.io/service]',
}

type SearchOptions = {
  defaultKey?: string
}

const isShortFilter = (k: string): k is keyof typeof filters => k in filters

export const searchRegex = /(\S+:\s*\S*)|(\S+)/

export const Resource = {
  search(query: string, options: SearchOptions = {}) {
    const { defaultKey = 'name' } = options
    const parts = query.trim().split(searchRegex).map((part) => part?.trim()).filter(Boolean)

    return parts.reduce((acc, curr) => {
      const [key, value] = curr.split(/:(.*)/).map((item) => item.trim().replace(/=/, ':'))
      
      switch(true) {
        case curr.includes(':') && !value?.length:
          return acc
        case key === defaultKey || !value?.length:
          return {
            ...acc,
            [defaultKey]: value?.length ? value : key,
          }
        case ['label', 'labels'].includes(key): {
          const [k, v] = value.split(/:(.*)/)
          return {
            ...acc,
            [`filter[labels.${k}]`]: v,
          }
        }
        case key?.length && !isShortFilter(key):
          return {
            ...acc,
            [`filter[labels.${key}]`]: value,
          }
        case !!key?.length: {
          const _key = isShortFilter(key) ? filters[key] : key
          return {
            ...acc,
            [_key]: value,
          }
        }
        default:
          return acc
      }
    }, {} as Record<string, string>)
  },
}
