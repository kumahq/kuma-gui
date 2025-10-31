import type { paths } from '@kumahq/kuma-http-api'

type PartialResourceTypes = paths['/_resources']['get']['responses']['200']['content']['application/json']
type PartialResourceType = PartialResourceTypes['resources'][number]
type PartialPolicyResourceType = PartialResourceType & Required<Pick<PartialResourceType, 'policy'>>

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

