import { InboundRule } from './InboundRule'
import { Origin } from './Origin'
import { ResourceRule } from './ResourceRule'
import type { KumaResourceTypeDescriptorCollection } from '@/app/resources/data'
import type { components } from '@kumahq/kuma-http-api'

type Entity = components['schemas']['Rule']
type InspectRules = components['schemas']['InspectRules']

export const Rule = {
  fromObject(item: Entity, resources: KumaResourceTypeDescriptorCollection) {
    const { conf = {}, origin, ...rest } = item
    const rules = (Array.isArray(conf.rules) ? conf.rules : []).map((rule) => {
      const { backendRefs = [], filters = [] } = rule.default

      return {
        ...item,
        matches: rule.matches,
        default: {
          backendRefs,
          filters,
        },
      }
    })
    return {
      ...rest,
      type: '',
      ruleType: 'to',
      raw: conf,
      config: {
        ...conf,
        // An omitted or empty hostnames list implies the wildcard hostname (meaning any hostnames apply).
        hostnames: Array.isArray(conf.hostnames) && conf.hostnames.length > 0 ? conf.hostnames : ['*'],
        rules,
      },
      origins: Array.isArray(origin) ? origin.map((o) => Origin.fromObject(o, resources)) : [],
      matchers: Array.isArray(item.matchers) ? item.matchers : [],
    }
  },
  fromCollection(item: InspectRules, resources: KumaResourceTypeDescriptorCollection) {
    const rules = Array.isArray(item.rules)
      ? item.rules.reduce((prev, item) => {
        // to rules we can just reshape.
        const to = Array.isArray(item.toRules)
          ? item.toRules.map(rule => {
            return {
              ...Rule.fromObject(rule, resources),
              ruleType: 'to',
              type: item.type,
            }
          })
          : []

        // from rules we can need to flatten out with reduce
        const from = Array.isArray(item.fromRules)
          ? item.fromRules.reduce((prev, rule) => {
            const { rules, ...rest } = rule
            return prev.concat(rules.map(r => {
              return {
                ...rest,
                ...Rule.fromObject(r, resources),
                ruleType: 'from',
                type: item.type,
              }
            }))
          }, [] as Rule[])
          : []

        // the proxyRule is only ever a single one, but we turn it into an array
        // with a single entry so it looks like to and from rules
        const proxy = typeof item.proxyRule !== 'undefined'
          ? [{
            ...Rule.fromObject(item.proxyRule as Entity, resources),
            ruleType: 'proxy',
            type: item.type,
          }]
          : []

        // concat all the rules now thay all look the same
        return prev.concat(to).concat(from).concat(proxy)
      }, [] as Rule[])
      : []

    const inboundRules = Array.isArray(item.rules)
      ? item.rules.reduce((prev, item) => {
        const inboundRules = Array.isArray(item.inboundRules)
          ? item.inboundRules.map(inboundRule => {
            return inboundRule.rules.map(rule => {
              return {
                ...InboundRule.fromObject({
                  ...rule,
                  ...inboundRule,
                  type: item.type,
                }, resources),
              }
            })
          }).flat()
          : []
        return prev.concat(inboundRules)
      }, [] as InboundRule[])
      : []

    const toResourceRules = Array.isArray(item.rules)
      ? item.rules.reduce((prev, item) => {
        const rules = Array.isArray(item.toResourceRules)
          ? item.toResourceRules.map(rule => {
            return {
              ...ResourceRule.fromObject(rule),
              type: item.type,
            }
          })
          : []
        return prev.concat(rules)
      }, [] as ResourceRule[])
      : []

    return {
      ...item,
      rules,
      inboundRules,
      toResourceRules,
    }
  },
}
export type Rule = ReturnType<typeof Rule['fromObject']> & {
  inbound?: components['schemas']['Inbound']
}
