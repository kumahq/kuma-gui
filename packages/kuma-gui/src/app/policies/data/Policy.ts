import { YAML } from '@/app/application'
import { Resource } from '@/app/resources/data/Resource'
import type { paths } from '@kumahq/kuma-http-api'

// we use MeshAccessLog as the basis for a "GenericPolicy"
type MeshAccessLog = paths['/meshes/{mesh}/meshaccesslogs/{name}']['get']['responses']['200']['content']['application/json']
type MeshAccessLogCollection = paths['/meshes/{mesh}/meshaccesslogs']['get']['responses']['200']['content']['application/json']
//

export type KumaPolicy = Omit<MeshAccessLog, 'spec' | 'name'> & {
  name: string
  spec: unknown & {
    targetRef: MeshAccessLog['spec']['targetRef']
  }
}
export type KumaPolicyCollection = Omit<MeshAccessLogCollection, 'items'> & {
  items: KumaPolicy[]
}
export type KumaPolicyPath = 'meshaccesslogs'

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

  fromCollection(partialPolicies: KumaPolicyCollection) {
    return {
      ...partialPolicies,
      items: Array.isArray(partialPolicies.items)
        ? partialPolicies.items.map((partialPolicy) => Policy.fromObject(partialPolicy))
        : [],
    }
  },
}
export type Policy = ReturnType<typeof Policy['fromObject']>

