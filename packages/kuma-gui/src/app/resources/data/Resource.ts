/**
 * Filters should follow the rules of [kong-aip#160](https://kong-aip.netlify.app/aip/160/).
 * 
 * `filters` are the current defaults, but may not necessarily be used depending on the actual requirements of an API.
 */
const shortFilters = {
  namespace: 'k8s.kuma.io/namespace',
  zone: 'kuma.io/zone',
  service: 'kuma.io/service',
  protocol: 'kuma.io/protocol',
}

type SearchOptions = {
  defaultKey?: string
}

const isShortFilter = (k: string): k is keyof typeof shortFilters => k in shortFilters

export const searchRegex = /(\S+:\s*\S*)|(\S+)/

const kvSeparatorRegex = /:(.*)/

export const Resource = {
  search(query: string, options: SearchOptions = {}) {
    const { defaultKey = 'name' } = options
    const parts = query.trim().split(searchRegex).map((part) => part?.trim().replace(/=/, ':')).filter(Boolean)

    return parts.reduce((acc, curr) => {
      const [key, value] = curr.split(kvSeparatorRegex).map((item) => item.trim())
      
      switch(true) {
        // Filter out invalids, such as: ":foo" or "bar:"
        case curr.includes(':') && !value?.length:
          return acc
        
        // Use defaultKey for single words, i.e. "foo" or "bar"
        case key === defaultKey || !value?.length:
          return {
            ...acc,
            [defaultKey]: value?.length ? value : key,
          }
        case ['label', 'labels'].includes(key): {
          const [k, v] = value.split(kvSeparatorRegex)
          const _key = `filter[labels.${isShortFilter(k) ? shortFilters[k] : k}]`
          return {
            ...acc,
            [_key]: v,
          }
        }
        case ['tag', 'tags'].includes(key): {
          const [k, v] = value.split(kvSeparatorRegex)
          const _value = isShortFilter(k) ? `${shortFilters[k]}:${v}` : value
          return {
            ...acc,
            tag: [...acc.tag ?? [], _value],
          }
        }
        case !!key?.length: {
          const _key = `filter[labels.${isShortFilter(key) ? shortFilters[key] : key}]`
          return {
            ...acc,
            [_key]: value,
          }
        }
        default:
          return acc
      }
    }, {} as Record<string, string | string[]>)
  },
}
