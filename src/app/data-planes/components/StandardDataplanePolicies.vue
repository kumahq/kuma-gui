<template>
  <div data-testid="standard-dataplane-policies">
    <h2 class="visually-hidden">
      Policies
    </h2>

    <PolicyTypeEntryList
      id="policies"
      :policy-type-entries="policyTypeEntries"
      data-testid="policy-list"
    />

    <div
      v-if="ruleEntries.length > 0"
      class="mt-2"
    >
      <h2 class="mb-2">
        Rules
      </h2>

      <RuleEntryList
        id="rules"
        :rule-entries="ruleEntries"
        data-testid="rule-list"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import PolicyTypeEntryList from './PolicyTypeEntryList.vue'
import RuleEntryList from './RuleEntryList.vue'
import {
  DataplaneRule,
  LabelValue,
  MatchedPolicyType,
  PolicyType,
  PolicyTypeEntry,
  PolicyTypeEntryConnection,
  PolicyTypeEntryOrigin,
  RuleEntry,
  RuleEntryConnection,
  SidecarDataplane,
} from '@/types/index.d'
import { toYaml } from '@/utilities/toYaml'

const props = defineProps<{
  sidecarDataplanes: SidecarDataplane[]
  rules: DataplaneRule[]
  policyTypesByName: Record<string, PolicyType | undefined>
}>()

const policyTypeEntries = computed(() => getPolicyTypeEntries(props.sidecarDataplanes))
const ruleEntries = computed(() => getRuleEntries(props.rules))

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
  const origin: PolicyTypeEntryOrigin = {
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
  const origins: PolicyTypeEntryOrigin[] = [origin]

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

/**
 * Transforms `DataplaneRule` objects into rule entries which are going to be displayed in this view.
 */
function getRuleEntries(rules: DataplaneRule[]): RuleEntry[] {
  // Uses a `Map` to store entries by type so they can be retrieved and updated while iterating over the rules.
  const policyTypeEntriesByType = new Map<string, RuleEntry>()

  for (const rule of rules) {
    if (!policyTypeEntriesByType.has(rule.policyType)) {
      policyTypeEntriesByType.set(rule.policyType, {
        type: rule.policyType,
        connections: [],
      })
    }

    const policyTypeEntry = policyTypeEntriesByType.get(rule.policyType) as RuleEntry
    const policyType = props.policyTypesByName[rule.policyType] as PolicyType
    const connections = getRuleEntryConnections(rule, policyType)

    policyTypeEntry.connections.push(...connections)
  }

  const policyTypeEntries = Array.from(policyTypeEntriesByType.values())

  policyTypeEntries.sort((policyTypeEntryA, policyTypeEntryB) => policyTypeEntryA.type.localeCompare(policyTypeEntryB.type))

  return policyTypeEntries
}

function getRuleEntryConnections(rule: DataplaneRule, policyType: PolicyType): RuleEntryConnection[] {
  const { type, service, subset, conf } = rule

  // Guards against likely API changes. The response currently contains `"subset": {}` instead of omitting the value or setting it to `null`, but that might change in the future.
  const subsetEntries = subset ? Object.entries(subset) : []
  let sourceTags: LabelValue[]
  let destinationTags: LabelValue[]

  // Determines source tags.
  if (type === 'ClientSubset') {
    if (subsetEntries.length > 0) {
    // For client subsets, the source is represented by `subset` (i.e. tags)
      sourceTags = subsetEntries.map(([label, value]) => ({ label, value }))
    } else {
      // Sets the wildcard service tag for client subsets without subset values.
      sourceTags = [
        {
          label: 'kuma.io/service',
          value: '*',
        },
      ]
    }
  } else {
    // For destination subsets and single items, the source is the DPP for which we don’t want to show anything.
    sourceTags = []
  }

  // Determines destination tags.
  if (type === 'DestinationSubset') {
    // For destination subsets, the destination is represented by either `subset` (which has priority) or `service`. `subset` is more specific than `service` so it needs to be handled first.
    if (subsetEntries.length > 0) {
      destinationTags = subsetEntries.map(([label, value]) => ({ label, value }))
    } else if (typeof service === 'string' && service !== '') {
      // The `service` field, when set, represents the name of the destination service of traffic.
      destinationTags = [
        {
          label: 'kuma.io/service',
          value: service,
        },
      ]
    } else {
      // For destination subsets with empty or absent `subset` field and empty or absent `service`, we can set the wildcard service tag to indicate that the traffic goes to all services.
      destinationTags = [
        {
          label: 'kuma.io/service',
          value: '*',
        },
      ]
    }
  } else if (type === 'ClientSubset' && typeof service === 'string' && service !== '') {
    // The `service` field, when set, represents the name of the destination service of traffic.
    destinationTags = [
      {
        label: 'kuma.io/service',
        value: service,
      },
    ]
  } else {
    destinationTags = []
  }

  const addresses = rule.addresses ?? []
  const config = conf && Object.keys(conf).length > 0 ? toYaml(conf) : null
  const origins: PolicyTypeEntryOrigin[] = []

  for (const ruleOrigin of rule.origins) {
    origins.push({
      name: ruleOrigin.name,
      route: {
        name: 'policy-detail-view',
        params: {
          mesh: ruleOrigin.mesh,
          policyPath: policyType.path,
          policy: ruleOrigin.name,
        },
      },
    })
  }

  const connection: RuleEntryConnection = { type: { sourceTags, destinationTags }, addresses, config, origins }

  return [connection]
}
</script>
