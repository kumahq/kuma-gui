import { components } from '@kumahq/kuma-http-api'

type PoliciesList = components['schemas']['PoliciesList']
type PolicyConf = components['schemas']['PolicyConf']

export const DataplanePolicies = {
  fromObject: (item: PolicyConf) => {
    return {
      ...item,
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
