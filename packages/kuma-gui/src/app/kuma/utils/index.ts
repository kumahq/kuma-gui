import { ApiError } from '../services/kuma-api/ApiError'
/**
 * Filters should follow the rules of [kong-aip#160](https://kong-aip.netlify.app/aip/160/).
 *
 * `filters` are the current defaults, but may not necessarily be used depending on the actual requirements of an API.
 */
const shortFilters: Record<string, string> = {
  namespace: 'k8s.kuma.io/namespace',
  zone: 'kuma.io/zone',
  service: 'kuma.io/service',
  protocol: 'kuma.io/protocol',
}

type SearchOptions = {
  defaultKey?: string
}

export const searchRegex = /(\S+:\s*\S*)|(\S+)/
const kvSeparatorRegex = /:(.*)/

export const parseSearch = (query: string, options: SearchOptions = {}) => {
  const { defaultKey = 'name' } = options
  const parts = query.trim().split(searchRegex).map((part) => part?.trim().replace(/=/, ':')).filter(Boolean)

  return parts.reduce((acc, curr) => {
    // if the part begins or ends with `:` it must be invalid
    // `term:`, `:term`, `:`, `::::`
    if (curr.startsWith(':') || curr.endsWith(':')) {
      return acc
    }

    // set some defaults: default key to defaultKey and default value to ''
    const [k, v = ''] = curr.split(kvSeparatorRegex).map((item) => item.trim())
    const [key, value] = v.length === 0 ? [defaultKey, k] : [k, v]

    // default accumulator tags/labels to {} incase we haven't already set those
    const { tags = {}, labels = {} } = acc

    switch (true) {
      // Use defaultKey  as the key for single words, i.e. "foo" or "bar"
      // i.e. when the key is actually the value
      case value.length === 0:
        return {
          ...acc,
          [defaultKey]: key,
        }
      // if the key is the default key then use that
      case key === defaultKey:
        return {
          ...acc,
          [key]: value,
        }
      // support old style tags, explicitly used `tag:key:value`
      // TODO: this will need to be optional
      case ['tag'].includes(key): {
        const [k, v = ''] = value.split(kvSeparatorRegex)
        return {
          ...acc,
          tags: {
            ...tags,
            [shortFilters[k] ?? k]: v,
          },
        }
      }
      // or if the key is anything other than the defaultKey, tag, or tags, turn
      // it into a label
      default: {
        // explicitly used `label:key:value` or, if not, it was just `key:value`
        const [k, v = ''] = ['label'].includes(key) ? value.split(kvSeparatorRegex) : [key, value]
        return {
          ...acc,
          labels: {
            ...labels,
            [shortFilters[k] ?? k]: v,
          },
        }
      }
    }
  }, {} as {
    labels?: Record<string, string>
    tags?: Record<string, string>
    [key: string]: string | Record<string, string> | undefined
  })
}

export const search = (query: string, options: SearchOptions = {}) => {
  const { labels = {}, tags = {}, ...rest } = parseSearch(query, options)

  return {
    ...rest,
    ...(Object.keys(labels).length > 0 ? Object.fromEntries(Object.entries(labels).map(([key, value]) => [`filter[labels.${key}]`, value])) : {}),
    ...(Object.keys(tags).length > 0 ? { tag: Object.entries(tags).map(([key, value]) => `${key}${value.length > 0 ? `:${value}` : ''}`) } : {}),
  } as typeof rest & { tag?: string[] }
}

export function semver(version: string): { major: string, minor: string, patch: string, pre: string } {
  const [major, minor, ...patchPre] = version.split('.')
  if (isNaN(parseInt(major))) {
    return {
      major,
      minor: major,
      patch: major,
      pre: major,
    }
  }
  const [patch, pre] = patchPre.join('.').split('-')
  return {
    major,
    minor: `${major}.${minor}`,
    patch: `${major}.${minor}.${patch}`,
    pre: `${major}.${minor}.${patch}${typeof pre !== 'undefined' ? `-${pre}` : ''}`,
  }
}
type FetchParams = Parameters<typeof globalThis.fetch>
export const createFetch = (fetch = globalThis.fetch) => {
  return async (...rest: FetchParams) => {
    try {
      const response = await fetch(...rest)
      if (response.ok) {
        return response
      } else {
        const contentType = response.headers.get('content-type')
        const isJson = contentType !== null ? contentType.startsWith('application/json') || contentType.startsWith('application/problem+json') : false
        const data = isJson ? await response.json() : await response.text()
        const error = typeof data === 'object' ? { ...data, status: data.status ?? response.status } : { title: data, status: response.status }
        throw new ApiError(error)
      }
    } catch (error) {
      if (error instanceof Error) {
        const completeUrl = typeof rest[0] === 'string' || rest[0] instanceof URL ? String(rest[0]) : rest[0].url
        error.message = `${error.message} (${completeUrl})`
      }
      throw error
    }
  }
}


