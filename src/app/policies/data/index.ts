import type { PaginatedApiListResponse } from '@/types/api.d'
import type {
  PolicyDataplane as PartialPolicyDataplane,
  PolicyEntity as PartialPolicy,
} from '@/types/index.d'

export type { PolicyType } from '@/types/index.d'

export type PolicyDataplane = PartialPolicyDataplane

export type Policy = PartialPolicy & {
  config: PartialPolicy
  id: string
  namespace: string
}

export const PolicyDataplane = {
  fromObject(partialPolicyDataplane: PartialPolicyDataplane): PolicyDataplane {
    return partialPolicyDataplane
  },

  fromCollection(partialPolicyDataplanes: PaginatedApiListResponse<PartialPolicyDataplane>): PaginatedApiListResponse<PolicyDataplane> {
    return {
      ...partialPolicyDataplanes,
      items: Array.isArray(partialPolicyDataplanes.items)
        ? partialPolicyDataplanes.items.map((partialPolicyDataplane) => PolicyDataplane.fromObject(partialPolicyDataplane))
        : [],
    }
  },
}

export const Policy = {
  fromObject(item: PartialPolicy): Policy {
    const labels = typeof item.labels !== 'undefined' ? item.labels : {}
    return {
      ...item,
      config: item,
      id: item.name,
      name: labels['kuma.io/display-name'] ?? item.name,
      namespace: labels['k8s.kuma.io/namespace'] ?? '',

    }
  },

  fromCollection(partialPolicies: PaginatedApiListResponse<PartialPolicy>): PaginatedApiListResponse<Policy> {
    return {
      ...partialPolicies,
      items: Array.isArray(partialPolicies.items)
        ? partialPolicies.items.map((partialPolicy) => Policy.fromObject(partialPolicy))
        : [],
    }
  },
}
