import { components } from '@kumahq/kuma-http-api'

import { FullKriString } from '@/app/kuma/kri'

type PoliciesList = components['schemas']['PoliciesList']
type PolicyConf = components['schemas']['PolicyConf']

export const DataplanePolicies = {
  fromObject: (item: PolicyConf) => {
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

  fromCollection: (item: PoliciesList) => {
    return {
      ...item,
      policies: item.policies?.map((policy) => {
        return DataplanePolicies.fromObject(policy)
      }) ?? [],
    }
  },
}

export type DataplanePolicies = ReturnType<typeof DataplanePolicies.fromCollection>
export type DataplanePolicy = ReturnType<typeof DataplanePolicies.fromObject>
