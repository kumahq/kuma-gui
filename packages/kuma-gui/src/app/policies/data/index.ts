import { paths } from '@kumahq/kuma-http-api'

import type { PaginatedApiListResponse } from '@/types/api.d'
import type {
  PolicyDataplane as PartialPolicyDataplane,
  PolicyEntity as PartialPolicy,
} from '@/types/index.d'

export type PartialResourceTypes = paths['/_resources']['get']['responses']['200']['content']['application/json']
export type PartialResourceType = PartialResourceTypes['resources'][number]
export type PartialPolicyResourceType = PartialResourceType & Required<Pick<PartialResourceType, 'policy'>>

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
  fromObject(item: PartialPolicy) {
    const labels = typeof item.labels !== 'undefined' ? item.labels : {}
    return {
      ...item,
      labels,
      id: item.name,
      name: labels['kuma.io/display-name'] ?? item.name,
      namespace: labels['k8s.kuma.io/namespace'] ?? '',
      zone: labels['kuma.io/origin'] === 'zone' && labels['kuma.io/zone'] ? labels['kuma.io/zone'] : '',
      role: labels['kuma.io/policy-role'] ?? '',
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
  isPolicyType(o: PartialResourceType): o is PartialPolicyResourceType {
    return typeof o.policy !== 'undefined'
  },

  fromObject(partialPolicyType: PartialPolicyResourceType) {
    return {
      ...partialPolicyType,
    }
  },

  fromCollection(partialResourceTypes: PartialResourceTypes) {
    return {
      ...partialResourceTypes,
      policyTypes: partialResourceTypes.resources.filter(PolicyResourceType.isPolicyType).map(PolicyResourceType.fromObject),
    }
  },
}
export type PolicyResourceType = ReturnType<typeof PolicyResourceType.fromObject>
