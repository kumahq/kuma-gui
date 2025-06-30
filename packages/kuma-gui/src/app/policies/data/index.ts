import { paths } from '@kumahq/kuma-http-api'

import { Resource } from '@/app/resources/data/Resource'
import type { PaginatedApiListResponse } from '@/types/api.d'
import type {
  PolicyDataplane as PartialPolicyDataplane,
  PolicyEntity as PartialPolicy,
} from '@/types/index.d'

type PartialResourceTypes = paths['/_resources']['get']['responses']['200']['content']['application/json']
type PartialResourceType = PartialResourceTypes['resources'][number]
type PartialPolicyResourceType = PartialResourceType & Required<Pick<PartialResourceType, 'policy'>>

export type PolicyDataplane = PartialPolicyDataplane & {
  id: string
  namespace: string
  zone: string
  labels: Exclude<PartialPolicyDataplane['labels'], undefined>
}

export const PolicyDataplane = {
  fromObject(item: PartialPolicyDataplane): PolicyDataplane {
    const labels = typeof item.labels !== 'undefined' ? item.labels : {}
    return {
      ...item,
      id: item.name,
      labels,
      zone: labels['kuma.io/zone'] ?? '',
      name: labels['kuma.io/display-name'] ?? item.name,
      namespace: labels['k8s.kuma.io/namespace'] ?? '',
    }
  },

  fromCollection(collection: PaginatedApiListResponse<PartialPolicyDataplane>): PaginatedApiListResponse<PolicyDataplane> {
    const items = Array.isArray(collection.items) ? collection.items.map(PolicyDataplane.fromObject) : []
    return {
      ...collection,
      items,
      total: collection.total ?? items.length,
    }
  },
}

export const Policy = {
  search(query: string) {
    return Resource.search(query)
  },

  fromObject(item: PartialPolicy) {
    const labels = typeof item.labels !== 'undefined' ? item.labels : {}
    return {
      ...item,
      labels,
      id: item.name,
      name: labels['kuma.io/display-name'] ?? item.name,
      namespace: labels['k8s.kuma.io/namespace'] ?? '',
      zone: labels['kuma.io/origin'] === 'zone' && labels['kuma.io/zone'] ? labels['kuma.io/zone'] : '',
      role: labels['kuma.io/policy-role'] ?? 'system',
      config: item,
    }
  },

  fromCollection(partialPolicies: PaginatedApiListResponse<PartialPolicy>) {
    return {
      ...partialPolicies,
      items: Array.isArray(partialPolicies.items)
        ? partialPolicies.items.map((partialPolicy) => Policy.fromObject(partialPolicy))
        : [],
    }
  },
}
export type Policy = ReturnType<typeof Policy['fromObject']>

export const PolicyResourceType = {
  fromObject(partialPolicyType: PartialPolicyResourceType) {
    return {
      ...partialPolicyType,
    }
  },

  fromCollection(partialResourceTypes: PartialResourceTypes) {
    const isPolicyType = (o: PartialResourceType): o is PartialPolicyResourceType => {
      return typeof o.policy !== 'undefined'
    }
    return {
      ...partialResourceTypes,
      policyTypes: partialResourceTypes.resources.filter(isPolicyType).map(PolicyResourceType.fromObject),
    }
  },
}
export type PolicyResourceType = ReturnType<typeof PolicyResourceType.fromObject>
export type ResourceCollection = ReturnType<typeof PolicyResourceType.fromCollection>
