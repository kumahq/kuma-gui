import { Kri } from '@/app/kuma'
import type { paths } from '@kumahq/kuma-http-api'


type KumaResourceCollection = Record<string, unknown>
export type KumaResource = paths['/_kri/{kri}']['get']['responses']['200']['content']['application/json']


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

export const Resource = {
  parseSearch(query: string, options: SearchOptions = {}) {
    const { defaultKey = 'name' } = options
    const parts = query.trim().split(searchRegex).map((part) => part?.trim().replace(/=/, ':')).filter(Boolean)

    return parts.reduce((acc, curr) => {
      // if the part begins or ends with `:` it must be invalid
      // `term:`, `:term`, `:`, `::::`
      if(curr.startsWith(':') || curr.endsWith(':')) {
        return acc
      }

      // set some defaults: default key to defaultKey and default value to ''
      const [k, v = ''] = curr.split(kvSeparatorRegex).map((item) => item.trim())
      const [key, value] = v.length === 0 ? [defaultKey, k] : [k, v]

      // default accumulator tags/labels to {} incase we haven't already set those
      const { tags = {}, labels = {} } = acc

      switch(true) {
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


  },
  
  search(query: string, options: SearchOptions = {}) {
    const { labels = {}, tags = {}, ...rest } = Resource.parseSearch(query, options)

    return {
      ...rest,
      ...(Object.keys(labels).length > 0 ? Object.fromEntries(Object.entries(labels).map(([key, value]) => [`filter[labels.${key}]`, value])) : {}),
      ...(Object.keys(tags).length > 0 ? { tag: Object.entries(tags).map(([key, value]) => `${key}${value.length > 0 ? `:${value}` : ''}`) }: {}),
    } as typeof rest & { tag?: string[] }
  },

  fromObject(partialResource: KumaResource) {
    const labels = 'labels' in partialResource ? partialResource.labels ?? {} : {}
    const mesh = 'mesh' in partialResource ? partialResource.mesh : labels['kuma.io/mesh'] ?? ''
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''
    const name =  labels['kuma.io/display-name'] ?? partialResource.name ?? ''
    const zone =  labels['kuma.io/origin'] === 'zone' ? labels['kuma.io/zone'] ?? '' : ''

    const kri = 'kri' in partialResource ? partialResource.kri ?? '' : ''

    return {
      ...partialResource,
      config: partialResource,
      id: partialResource.name,
      kri: Kri.isKriString(kri) ? kri : Kri.toString({ shortName: `~${partialResource.type?.toLowerCase()}`, mesh, zone, namespace, name }),
      mesh,
      namespace,
      name,
      zone,
      creationTime: 'creationTime' in partialResource ? partialResource.creationTime : '',
      modificationTime: 'modificationTime' in partialResource ? partialResource.modificationTime : '',
      labels: partialResource.labels ?? {},
      type: partialResource.type ?? '',
    }
  },

  fromCollection(partialResources: KumaResourceCollection = {}) {
    const collection = Object.values(partialResources).find((value) => Array.isArray(value)) ?? []
    return {
      ...partialResources,
      items: collection.map(Resource.fromObject),
      total: partialResources.total as number | undefined ?? collection.length ?? 0,
    }
  },
}

export type Resource = ReturnType<typeof Resource.fromObject>
export type ResourceCollection = ReturnType<typeof Resource.fromCollection>
