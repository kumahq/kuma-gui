type SearchFromQueryOptions = {
  fallbackKey?: string
  filterKeys?: Record<string, string>
}

export class Search {
  static readonly filters = {
    namespace: 'filter[labels.k8s.kuma.io/namespace]',
    zone: 'filter[labels.kuma.io/zone]',
  }

  static fromQuery(query: string, options: SearchFromQueryOptions = {}) {
    const { fallbackKey = 'name', filterKeys } = options
    const parts = query.trim().split(/\s+/)

    return parts.reduce((acc, curr) => {
      const [key, value] = curr.split(/:(.*)/)
      switch(true) {
        case Boolean(value):
          return {
            ...acc,
            [filterKeys?.[key] ?? key]: value,
          }
        case curr.includes(':') || (!key && !value):
          // at this point this would be an invalid query, i.e. `name:`
          return acc
        default:
          return {
            ...acc,
            [fallbackKey]: key,
          }
      }
    }, {} as Record<string, string>)
  }
}
