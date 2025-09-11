import type { components } from '@kumahq/kuma-http-api'

type ResourceRuleOrigin = components['schemas']['ResourceRuleOrigin']
type ResourceMeta = components['schemas']['Meta']
type PartialOrigin = ResourceRuleOrigin | ResourceMeta

export const Origin = {
  fromObject(origin: PartialOrigin) {
    const hasResourceMeta = (o: PartialOrigin): o is ResourceRuleOrigin => 'resourceMeta' in o
    const {
      type = '',
      mesh = '',
      name = '',
      labels = {},
    } = (hasResourceMeta(origin) ? origin.resourceMeta : origin) ?? {}

    return {
      ...origin,
      type,
      mesh,
      name,
      labels,
    }
  },
}
