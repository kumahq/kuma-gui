import { components } from '@kumahq/kuma-http-api'

import { Origin } from './Origin'

type PartialInboundRule = components['schemas']['InboundRule'] & { type: string, inbound: components['schemas']['Inbound'] }
type Matcher = components['schemas']['RuleMatcher']

export const InboundRule = {
  fromObject(item: PartialInboundRule) {
    const { conf, origin, ...rest } = item

    return {
      ...rest,
      conf,
      raw: conf,
      config: conf,
      origins: Array.isArray(origin) ? origin.map(o => ({
        ...o,
        ...Origin.fromObject(o),
      })) : [],
      matchers: [] as Matcher[],
      ruleType: 'inbound',
    }
  },
}
export type InboundRule = ReturnType<typeof InboundRule['fromObject']>
