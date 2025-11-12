import { YAML } from '@/app/application'
import { Resource } from '@/app/resources/data/Resource'
import type { components } from '@kumahq/kuma-http-api'

export type KumaPolicy = components['schemas']['Policy']
export type KumaPolicyCollection = components['schemas']['PolicyCollection']

/**
 * @description we use this to workaround the fact that sometimes we need to call URLs with
 * a dynamic path
 */
export type DynamicPath = 'meshaccesslogs'

export const Policy = {
  search(query: string) {
    return Resource.search(query)
  },

  fromObject(item: KumaPolicy) {
    const labels = typeof item.labels !== 'undefined' ? item.labels : {}
    return {
      ...item,
      labels,
      id: item.name,
      name: labels['kuma.io/display-name'] ?? item.name,
      namespace: labels['k8s.kuma.io/namespace'] ?? '',
      zone: labels['kuma.io/origin'] === 'zone' && labels['kuma.io/zone'] ? labels['kuma.io/zone'] : '',
      // ideally this would be done upstream, or we add it to our overlays. For now we check at runtime
      role: (['producer', 'consumer', 'system', 'workload-owner'] as const).find((item) => item === labels['kuma.io/policy-role']) ?? 'system',
      config: item,
      yaml: YAML.stringify(item),
    }
  },

  fromCollection(collection: KumaPolicyCollection) {
    const items = Array.isArray(collection.items) ? collection.items.map(Policy.fromObject) : []
    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}
export type Policy = ReturnType<typeof Policy['fromObject']>

