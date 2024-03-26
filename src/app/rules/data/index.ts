import type {
  InspectBaseRule,
  InspectInbound,
  InspectRulesForDataplane as PartialInspectRulesForDataplane,
} from '@/types/index.d'

export type Rule = Omit<InspectBaseRule, 'conf' | 'origin'> & {
  type: string
  ruleType: string
  inbound?: InspectInbound
  config: InspectBaseRule['conf']
  origins: InspectBaseRule['origin']
}
export type RuleCollection = Omit<PartialInspectRulesForDataplane, 'rules'> & {
  rules: Rule[]
}
export const Rule = {
  fromObject(item: InspectBaseRule): Rule {
    const { conf, origin, matchers, ...rest } = item
    return {
      type: '',
      ruleType: '',
      ...rest,
      config: Object.keys(conf || {}).length > 0 ? conf : {},
      origins: Array.isArray(origin) ? origin : [],
      matchers: Array.isArray(matchers) ? matchers : [],
    }
  },
  fromCollection(partialInspectRules: PartialInspectRulesForDataplane): RuleCollection {
    const rules = Array.isArray(partialInspectRules.rules)
      ? partialInspectRules.rules.reduce<Rule[]>((prev, item) => {
      // to rules we can just reshape.
        const to = Array.isArray(item.toRules)
          ? item.toRules.map(rule => {
            return {
              ...Rule.fromObject(rule),
              type: item.type,
              ruleType: 'to',
            }
          })
          : []

        // from rules we can need to flatten out with reduce
        const from = Array.isArray(item.fromRules)
          ? item.fromRules.reduce<Rule[]>((prev, rule) => {
            const { rules, ...rest } = rule
            return prev.concat(rules.map(r => {
              return {
                ...rest,
                ...Rule.fromObject(r),
                type: item.type,
                ruleType: 'from',
              }
            }))
          }, [])
          : []

        // the proxyRule is only ever a single one, but we turn it into an array
        // with a single entry so it looks like to and from rules
        const proxy = typeof item.proxyRule !== 'undefined'
          ? [{
            ...Rule.fromObject(item.proxyRule as InspectBaseRule),
            type: item.type,
            ruleType: 'proxy',
          }]
          : []

        // concat all the rules now thay all look the same
        return prev.concat(to).concat(from).concat(proxy)
      }, [])
      : []
    return {
      ...partialInspectRules,
      rules,
    }
  },
}
