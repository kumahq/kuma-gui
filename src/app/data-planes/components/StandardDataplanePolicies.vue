<template>
  <div
    data-testid="standard-dataplane-policies"
    class="stack"
  >
    <KCard v-if="props.showPoliciesSection">
      <PolicyTypeEntryList
        id="policies"
        :policy-type-entries="policyTypeEntries"
        data-testid="policy-list"
      />
    </KCard>

    <KCard v-if="proxyRule">
      <h3>{{ t('data-planes.routes.item.proxy_rule') }}</h3>

      <RuleEntryList
        id="proxy-rules"
        class="mt-2"
        :rule-entries="[proxyRule]"
        :show-matchers="false"
        data-testid="proxy-rule-list"
      />
    </KCard>

    <KCard v-if="toRuleEntries.length > 0">
      <h3>{{ t('data-planes.routes.item.to_rules') }}</h3>

      <RuleEntryList
        id="to-rules"
        class="mt-2"
        :rule-entries="toRuleEntries"
        data-testid="to-rule-list"
      />
    </KCard>

    <KCard v-if="fromRuleInbounds.length > 0">
      <h3 class="mb-2">
        {{ t('data-planes.routes.item.from_rules') }}
      </h3>

      <div
        v-for="(fromRule, index) in fromRuleInbounds"
        :key="index"
      >
        <h4>{{ t('data-planes.routes.item.port', { port: fromRule.port }) }}</h4>

        <RuleEntryList
          :id="`from-rules-${index}`"
          class="mt-2"
          :rule-entries="fromRule.ruleEntries"
          :data-testid="`from-rule-list-${index}`"
        />
      </div>
    </KCard>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import PolicyTypeEntryList, { type PolicyTypeEntry, type PolicyTypeEntryConnection } from './PolicyTypeEntryList.vue'
import RuleEntryList, { type RuleEntry, type RuleEntryRule } from './RuleEntryList.vue'
import { useI18n } from '@/app/application'
import {
  InspectBaseRule,
  InspectRulesForDataplane,
  LabelValue,
  MatchedPolicyType,
  PolicyType,
  SidecarDataplane,
} from '@/types/index.d'
import { toYaml } from '@/utilities/toYaml'
import type { RouteLocationNamedRaw } from 'vue-router'

const { t } = useI18n()

const props = defineProps<{
  sidecarDataplanes: SidecarDataplane[]
  inspectRulesForDataplane: InspectRulesForDataplane
  policyTypesByName: Record<string, PolicyType | undefined>
  showPoliciesSection: boolean
}>()

const policyTypeEntries = computed(() => getPolicyTypeEntries(props.sidecarDataplanes))

const proxyRule = computed<RuleEntry | null>(() => {
  // Note, there can only be one proxy rule.
  const rule = props.inspectRulesForDataplane.rules.find((rule) => rule.proxyRule)
  if (!rule || !rule.proxyRule) {
    return null
  }

  const { type, proxyRule } = rule

  const config = proxyRule.conf && Object.keys(proxyRule.conf).length > 0 ? toYaml(proxyRule.conf) : undefined
  const origins = proxyRule.origin.map((origin) => {
    const policyType = props.policyTypesByName[origin.type]!

    return {
      name: origin.name,
      route: {
        name: 'policy-detail-view',
        params: {
          mesh: origin.mesh,
          policyPath: policyType.path,
          policy: origin.name,
        },
      },
    }
  })

  return {
    type,
    rules: [
      {
        config,
        origins,
      },
    ],
  }
})

/**
 * The to rule entries are grouped by policy type.
 */
const toRuleEntries = computed<RuleEntry[]>(() => {
  const ruleEntries: RuleEntry[] = []

  for (const rule of props.inspectRulesForDataplane.rules) {
    const toRules = rule.toRules ?? []

    if (toRules.length > 0) {
      ruleEntries.push({
        type: rule.type,
        rules: getRules(toRules),
      })
    }
  }

  ruleEntries.sort((ruleEntryA, ruleEntryB) => ruleEntryA.type.localeCompare(ruleEntryB.type))

  return ruleEntries
})

const fromRuleInbounds = computed<Array<{ port: number, ruleEntries: RuleEntry[] }>>(() => {
  // Group rule entries by inbound
  const ruleEntriesByInbound = new Map<number, RuleEntry[]>()

  for (const rule of props.inspectRulesForDataplane.rules) {
    const fromRules = rule.fromRules ?? []
    if (fromRules.length === 0) {
      continue
    }

    for (const fromRule of fromRules) {
      if (!ruleEntriesByInbound.has(fromRule.inbound.port)) {
        ruleEntriesByInbound.set(fromRule.inbound.port, [])
      }

      // This access is safe because we previously ensured this Map item exists.
      const ruleEntries = ruleEntriesByInbound.get(fromRule.inbound.port)!
      ruleEntries.push({
        type: rule.type,
        rules: getRules(fromRule.rules),
      })
    }
  }

  for (const [, ruleEntries] of ruleEntriesByInbound) {
    ruleEntries.sort((ruleEntryA, ruleEntryB) => ruleEntryA.type.localeCompare(ruleEntryB.type))
  }

  const fromRules = Array.from(ruleEntriesByInbound)
  fromRules.sort(([portA], [portB]) => portB - portA)

  return fromRules.map(([port, ruleEntries]) => ({ port, ruleEntries }))
})

/**
 * Transforms `SidecarDataplane` objects into policy type entries which are going to be displayed in this view.
 */
function getPolicyTypeEntries(sidecarDataplanes: SidecarDataplane[]): PolicyTypeEntry[] {
  // Uses a `Map` to store entries by type so they can be retrieved and updated while iterating over the `SidecarDataplane` objects.
  const policyTypeEntriesByType = new Map<string, PolicyTypeEntry>()

  for (const sidecarDataplane of sidecarDataplanes) {
    const { type, service } = sidecarDataplane

    // The `service` field, when set, represents the name of the destination service of traffic.
    const destinationTags: LabelValue[] = typeof service === 'string' && service !== '' ? [{ label: 'kuma.io/service', value: service }] : []
    const name = type === 'inbound' || type === 'outbound' ? sidecarDataplane.name : null

    for (const [policyTypeName, policies] of Object.entries(sidecarDataplane.matchedPolicies)) {
      if (!policyTypeEntriesByType.has(policyTypeName)) {
        policyTypeEntriesByType.set(policyTypeName, {
          type: policyTypeName,
          connections: [],
        })
      }

      const policyTypeEntry = policyTypeEntriesByType.get(policyTypeName) as PolicyTypeEntry
      const policyType = props.policyTypesByName[policyTypeName] as PolicyType

      for (const policy of policies) {
        const connections = getPolicyTypeEntryConnections(policy, policyType, sidecarDataplane, destinationTags, name)

        policyTypeEntry.connections.push(...connections)
      }
    }
  }

  const policyTypeEntries = Array.from(policyTypeEntriesByType.values())

  policyTypeEntries.sort((policyTypeEntryA, policyTypeEntryB) => policyTypeEntryA.type.localeCompare(policyTypeEntryB.type))

  return policyTypeEntries
}

function getPolicyTypeEntryConnections(policy: MatchedPolicyType, policyType: PolicyType, sidecarDataplane: SidecarDataplane, destinationTags: LabelValue[], name: string | null): PolicyTypeEntryConnection[] {
  const config = policy.conf && Object.keys(policy.conf).length > 0 ? toYaml(policy.conf) : null
  const origin: { name: string, route: RouteLocationNamedRaw } = {
    name: policy.name,
    route: {
      name: 'policy-detail-view',
      params: {
        mesh: policy.mesh,
        policyPath: policyType.path,
        policy: policy.name,
      },
    },
  }
  const origins = [origin]

  const policyTypeEntryConnections: PolicyTypeEntryConnection[] = []

  if (sidecarDataplane.type === 'inbound' && Array.isArray(policy.sources)) {
    for (const { match } of policy.sources) {
      const sourceTags: LabelValue[] = [{ label: 'kuma.io/service', value: match['kuma.io/service'] }]
      const connection: PolicyTypeEntryConnection = { sourceTags, destinationTags, name, config, origins }

      policyTypeEntryConnections.push(connection)
    }
  } else {
    const sourceTags: LabelValue[] = []
    const connection: PolicyTypeEntryConnection = { sourceTags, destinationTags, name, config, origins }

    policyTypeEntryConnections.push(connection)
  }

  return policyTypeEntryConnections
}

function getRules(rules: InspectBaseRule[]): RuleEntryRule[] {
  return rules.map(({ conf, matchers, origin }) => {
    const config = conf && Object.keys(conf).length > 0 ? toYaml(conf) : undefined
    const origins = origin.map((origin) => {
      const policyType = props.policyTypesByName[origin.type]!

      return {
        name: origin.name,
        route: {
          name: 'policy-detail-view',
          params: {
            mesh: origin.mesh,
            policyPath: policyType.path,
            policy: origin.name,
          },
        },
      }
    })

    return {
      config,
      matchers,
      origins,
    }
  })
}
</script>
