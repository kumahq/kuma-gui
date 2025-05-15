import { Resource } from '@/app/resources/data/Resource'
import type { components } from '@kumahq/kuma-http-api'

type HostnameGeneratorList = components['responses']['HostnameGeneratorList']['content']['application/json']
type HostnameGeneratorItem = components['responses']['HostnameGeneratorItem']['content']['application/json']

export const HostnameGenerator = {
  search(query: string) {
    return Resource.search(query)
  },

  fromObject(item: HostnameGeneratorItem) {
    const labels = item.labels ?? {}
    const name = labels['kuma.io/display-name'] ?? item.name
    const namespace = labels['k8s.kuma.io/namespace'] ?? ''

    return {
      ...item,
      id: item.name,
      name,
      namespace,
      zone: labels['kuma.io/origin'] === 'zone' && labels['kuma.io/zone'] ? labels['kuma.io/zone'] : '',
      creationTime: item.creationTime ?? '',
      modificationTime: item.modificationTime ?? '',
      spec: ((item = {}) => {
        return {
          ...item,
          selector: ((item = {}) => {
            return {
              meshService: {
                matchLabels: item.meshService?.matchLabels ?? {},
              },
              meshExternalService: {
                matchLabels: item.meshExternalService?.matchLabels ?? {},
              },
              meshMultiZoneService: {
                matchLabels: item.meshMultiZoneService?.matchLabels ?? {},
              },
            }
          })(item.selector),
        }
      })(item.spec),
      $raw: item,
    }
  },

  fromCollection(collection: HostnameGeneratorList) {
    const items = Array.isArray(collection.items) ? collection.items.map(HostnameGenerator.fromObject) : []
    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}

export type HostnameGenerator = ReturnType<typeof HostnameGenerator.fromObject>
