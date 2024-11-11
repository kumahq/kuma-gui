import type { components, paths } from '@/types/auto-generated'

// TODO(schogges): Remove `creationTime` and `modificationTime` once the api specs are complete
export type HostnameGeneratorList = Omit<components['responses']['HostnameGeneratorList']['content']['application/json'], 'items'> & {
  items: NonNullable<components['responses']['HostnameGeneratorList']['content']['application/json']['items']>[number] & {
    creationTime: string
    modificationTime: string
  } | undefined
}
export type HostnameGeneratorItem = components['responses']['HostnameGeneratorItem']['content']['application/json'] & {
  creationTime: string
  modificationTime: string
}
export type HostnameGeneratorGetParams = paths['/hostnamegenerators/{name}']['get']['parameters']

export interface HostnameGenerator extends HostnameGeneratorItem {
  id: string
  namespace: string
  zone: string
  mesh: string
  selector?: keyof NonNullable<HostnameGeneratorItem['spec']['selector']> | undefined
  $raw: HostnameGeneratorItem
}

export const HostnameGenerator = {
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
      mesh: labels['kuma.io/mesh'] || 'default',
      $raw: item,
      selector: item.spec.selector ? Object.keys(item.spec.selector)[0] as keyof typeof item.spec.selector : undefined,
    } satisfies HostnameGenerator
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
