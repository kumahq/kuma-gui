import { YAML } from '@/app/application'
import { Resource } from '@/app/resources/data/Resource'
import type { paths } from '@kumahq/kuma-http-api'

// we use MeshAccessLog as the basis for a "GenericPolicy"
type MeshAccessLog = paths['/meshes/{mesh}/meshaccesslogs/{name}']['get']['responses']['200']['content']['application/json']
type MeshAccessLogCollection = paths['/meshes/{mesh}/meshaccesslogs']['get']['responses']['200']['content']['application/json']
//

export type KumaLegacyPolicy = {
  type: string
  name: string
  mesh: string
  labels?: {
    [key: string]: string
  }
  creationTime: string
  modificationTime: string
  // having an optional targetRef here is totally wrong but its what we've
  // always had and legacy policies are being deleted soon so :shrug:
  spec: unknown & {
    targetRef?: MeshAccessLog['spec']['targetRef']
  }
}
export type KumaPolicy = ({
  // overwrite `MeshAccessLog` with string to cover all policies, including unknown ones
  name: string
  // overwrite spec to only include top-level targetRef
  spec: unknown & {
    targetRef: MeshAccessLog['spec']['targetRef']
  }
} & Omit<MeshAccessLog, 'spec' | 'name'>) | KumaLegacyPolicy

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

