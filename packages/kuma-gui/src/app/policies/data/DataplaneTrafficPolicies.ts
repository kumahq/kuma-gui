import { components } from '@kumahq/kuma-http-api'

import type { FullKriString } from '@/app/kuma/kri'

type OutboundPoliciesList = components['schemas']['PoliciesList']
type OutboundPolicyConf = components['schemas']['PolicyConf']

export const DataplaneOutboundPolicies = {
  fromObject: (item: OutboundPolicyConf) => {
    return {
      ...item,
      origins: item.origins.map((origin) => {
        return {
          ...origin,
          kri: origin.kri as FullKriString,
        }
      }),
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
      origins: item.origins.map((origin) => {
        return {
          ...origin,
          kri: origin.kri as FullKriString,
        }
      }),
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
