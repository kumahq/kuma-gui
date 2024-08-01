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

export type Rule = Omit<InspectBaseRule, 'conf' | 'origin' | 'toResourceRules'> & {
  type: string
  ruleType: 'to' | 'from' | 'proxy'
  inbound?: InspectInbound
  raw: InspectBaseRule['conf']
  config: RuleConf
  origins: InspectBaseRule['origin']
  resources: NonNullable<PartialInspectRulesForDataplane['toResourceRules']>
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
      resources: [],
    }
  },
  fromCollection(collection: PartialInspectRulesForDataplane): RuleCollection {
    const resourceMap = new Map<Number, PartialInspectRulesForDataplane['toResourceRules']>();
    (collection.toResourceRules ?? []).forEach(item => {
      const index = item.origin.ruleIndex
      if (!resourceMap.has(index)) {
        resourceMap.set(index, [])
      }
      resourceMap.get(index)!.push(item)
    })

    const rules = Array.isArray(collection.rules)
      ? collection.rules.reduce<Rule[]>((prev, item, i) => {
        // to rules we can just reshape.
        const to: Rule[] = Array.isArray(item.toRules)
          ? item.toRules.map(rule => {
            return {
              ...Rule.fromObject(rule),
              ruleType: 'to',
              type: item.type,
              resources: resourceMap.has(i) ? [...resourceMap.get(i)!] : [],
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
                resources: [],
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
            resources: [],
          }]
          : []

        // concat all the rules now thay all look the same
        return prev.concat(to).concat(from).concat(proxy)
      }, [])
      : []

    return {
      ...collection,
      rules,
    }
  },
}
