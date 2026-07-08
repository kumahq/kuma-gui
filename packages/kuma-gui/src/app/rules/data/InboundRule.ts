import { Origin } from './Origin'
import type { KumaResourceTypeDescriptorCollection } from '@/app/resources/data'
import type { components } from '@kumahq/kuma-http-api'


type PartialInboundRule = components['schemas']['InboundRule'] & { type: string, inbound: components['schemas']['Inbound'] }
type Matcher = components['schemas']['RuleMatcher']

export const InboundRule = {
  fromObject(item: PartialInboundRule, resources: KumaResourceTypeDescriptorCollection) {
    const { conf, origin, ...rest } = item

    return {
      ...rest,
      conf,
      raw: conf,
      config: conf,
      origins: Array.isArray(origin) ? origin.map(o => ({
        ...o,
        ...Origin.fromObject(o, resources),
      })) : [],
      matchers: [] as Matcher[],
      ruleType: 'inbound',
    }
  },
}
export type InboundRule = ReturnType<typeof InboundRule['fromObject']>
