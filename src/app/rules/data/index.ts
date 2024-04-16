import type {
  InspectBaseRule,
  InspectInbound,
  InspectRulesForDataplane as PartialInspectRulesForDataplane,
  ToTargetRefRule as PartialToTargetRefRule,
  TargetRef,
  ToTargetRefFilter,
} from '@/types/index.d'
export type ToTargetRefRule = Exclude<PartialToTargetRefRule, 'default'> & {
  default: {
    backendRefs: TargetRef[]
    filters: ToTargetRefFilter[]
  }
}

type RuleConf = Exclude<InspectBaseRule['conf'], 'hostnames' | 'rules'> & {
  hostnames: string[]
  rules: ToTargetRefRule[]
}

export type Rule = Omit<InspectBaseRule, 'conf' | 'origin'> & {
  type: string
  ruleType: 'to' | 'from' | 'proxy'
  inbound?: InspectInbound
  raw: InspectBaseRule['conf']
  config: RuleConf
  origins: InspectBaseRule['origin']
}
export type RuleCollection = Omit<PartialInspectRulesForDataplane, 'rules'> & {
  rules: Rule[]
}
export const Rule = {
  fromObject(item: InspectBaseRule): Rule {
    const { conf = {}, origin, matchers, ...rest } = item
    const rules = (Array.isArray(conf.rules) ? conf.rules : []).map((rule) => {
      const { backendRefs = [], filters = [] } = rule.default

      return {
        matches: rule.matches,
        default: {
          backendRefs,
          filters,
        },
      }
    })

    return {
      type: '',
      ruleType: 'to',
      ...rest,
      raw: conf,
      config: {
        ...conf,
        // An omitted or empty hostnames list implies the wildcard hostname (meaning any hostnames apply).
        hostnames: Array.isArray(conf.hostnames) && conf.hostnames.length > 0 ? conf.hostnames : ['*'],
        rules,
      },
      origins: Array.isArray(origin) ? origin : [],
      matchers: Array.isArray(matchers) ? matchers : [],
    }
  },
  fromCollection(partialInspectRules: PartialInspectRulesForDataplane): RuleCollection {
    const rules = Array.isArray(partialInspectRules.rules)
      ? partialInspectRules.rules.reduce<Rule[]>((prev, item) => {
      // to rules we can just reshape.
        const to: Rule[] = Array.isArray(item.toRules)
          ? item.toRules.map(rule => {
            return {
              ...Rule.fromObject(rule),
              ruleType: 'to',
              type: item.type,
            }
          })
          : []

        // from rules we can need to flatten out with reduce
        const from: Rule[] = Array.isArray(item.fromRules)
          ? item.fromRules.reduce<Rule[]>((prev, rule) => {
            const { rules, ...rest } = rule
            return prev.concat(rules.map(r => {
              return {
                ...rest,
                ...Rule.fromObject(r),
                ruleType: 'from',
                type: item.type,
              }
            }))
          }, [])
          : []

        // the proxyRule is only ever a single one, but we turn it into an array
        // with a single entry so it looks like to and from rules
        const proxy: Rule[] = typeof item.proxyRule !== 'undefined'
          ? [{
            ...Rule.fromObject(item.proxyRule as InspectBaseRule),
            ruleType: 'proxy',
            type: item.type,
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
