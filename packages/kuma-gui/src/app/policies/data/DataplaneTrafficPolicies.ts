import type { components } from '@kumahq/kuma-http-api'

type OutboundPoliciesList = components['schemas']['PoliciesList']
type OutboundPolicyConf = components['schemas']['PolicyConf']

export const DataplaneOutboundPolicies = {
  fromObject: (item: OutboundPolicyConf) => {
    return {
      ...item,
    }
  },

  fromCollection: (item: OutboundPoliciesList) => {
    return {
      ...item,
      policies: item.policies.map((policy) => {
        return DataplaneOutboundPolicies.fromObject(policy)
      }),
    }
  },
}

type InboundPoliciesList = components['schemas']['InboundPoliciesList']
type InboundPolicyConf = components['schemas']['InboundPolicyConf']

export const DataplaneInboundPolicies = {
  fromObject: (item: InboundPolicyConf) => {
    return {
      ...item,
    }
  },

  fromCollection: (item: InboundPoliciesList) => {
    return {
      ...item,
      policies: item.policies.map((policy) => {
        return DataplaneInboundPolicies.fromObject(policy)
      }),
    }
  },
}
