<template>
  <LoadingBlock v-if="isLoading" />

  <ErrorBlock
    v-else-if="error !== null"
    :error="error"
  />

  <div
    v-else-if="policyTypeEntries.length > 0"
    class="policies-list"
  >
    <SidecarDataplanePolicyList
      :dpp-name="props.dataplaneOverview.name"
      :policy-type-entries="policyTypeEntries"
      :rule-entries="ruleEntries"
    />
  </div>

  <div
    v-else-if="meshGatewayListenerEntries.length > 0 && meshGatewayDataplane !== null"
    class="policies-list"
  >
    <MeshGatewayDataplanePolicyList
      :mesh-gateway-dataplane="meshGatewayDataplane"
      :mesh-gateway-listener-entries="meshGatewayListenerEntries"
      :mesh-gateway-route-policies="meshGatewayRoutePolicies"
    />
  </div>

  <EmptyBlock v-else />
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from 'vue'

import MeshGatewayDataplanePolicyList from './MeshGatewayDataplanePolicyList.vue'
import SidecarDataplanePolicyList from './SidecarDataplanePolicyList.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import {
  DataPlaneOverview,
  DataplaneRule,
  LabelValue,
  MeshGatewayDataplane,
  MeshGatewayListenerEntry,
  MeshGatewayRouteEntry,
  MeshGatewayRoutePolicy,
  MatchedPolicyType,
  PolicyTypeEntry,
  PolicyTypeEntryConnection,
  PolicyTypeEntryOrigin,
  RuleEntry,
  RuleEntryConnection,
  SidecarDataplane,
} from '@/types/index.d'
import { useKumaApi } from '@/utilities'
import { toYaml } from '@/utilities/toYaml'

const kumaApi = useKumaApi()

const props = defineProps({
  dataplaneOverview: {
    type: Object as PropType<DataPlaneOverview>,
    required: true,
  },
})

const meshGatewayDataplane = ref<MeshGatewayDataplane | null>(null)
const policyTypeEntries = ref<PolicyTypeEntry[]>([])
const ruleEntries = ref<RuleEntry[]>([])
const meshGatewayListenerEntries = ref<MeshGatewayListenerEntry[]>([])
const meshGatewayRoutePolicies = ref<MeshGatewayRoutePolicy[]>([])
const isLoading = ref(true)
const error = ref<Error | null>(null)

watch(() => props.dataplaneOverview.name, function () {
  fetchPolicies()
})

fetchPolicies()

async function fetchPolicies(): Promise<void> {
  error.value = null
  isLoading.value = true
  policyTypeEntries.value = []
  ruleEntries.value = []
  meshGatewayListenerEntries.value = []
  meshGatewayRoutePolicies.value = []

  try {
    const isMeshGatewayDataplane = props.dataplaneOverview.dataplane.networking.gateway?.type?.toUpperCase() === 'BUILTIN'

    if (isMeshGatewayDataplane) {
      meshGatewayDataplane.value = await kumaApi.getMeshGatewayDataplane({
        mesh: props.dataplaneOverview.mesh,
        name: props.dataplaneOverview.name,
      })

      meshGatewayListenerEntries.value = getMeshGatewayListenerEntries(meshGatewayDataplane.value)
      meshGatewayRoutePolicies.value = getPolicyRoutes(meshGatewayDataplane.value.policies)
    } else {
      const { items: sidecarDataplanes } = await kumaApi.getSidecarDataplanePolicies({
        mesh: props.dataplaneOverview.mesh,
        name: props.dataplaneOverview.name,
      })

      policyTypeEntries.value = getPolicyTypeEntries(sidecarDataplanes ?? [])

      const { items: rules } = await kumaApi.getDataplaneRules({
        mesh: props.dataplaneOverview.mesh,
        name: props.dataplaneOverview.name,
      })

      ruleEntries.value = getRuleEntries(rules ?? [])
    }
  } catch (err) {
    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }
  } finally {
    isLoading.value = false
  }
}

function getMeshGatewayListenerEntries(meshGatewayDataplane: MeshGatewayDataplane): MeshGatewayListenerEntry[] {
  const meshGatewayListenerEntries: MeshGatewayListenerEntry[] = []

  const listeners = meshGatewayDataplane.listeners ?? []
  for (const listener of listeners) {
    for (const host of listener.hosts) {
      for (const route of host.routes) {
        const routeEntries: MeshGatewayRouteEntry[] = []

        for (const destination of route.destinations) {
          const policies = getPolicyRoutes(destination.policies)

          const routeEntry: MeshGatewayRouteEntry = {
            routeName: route.route,
            route: {
              name: 'policy-detail-view',
              params: {
                mesh: meshGatewayDataplane.gateway.mesh,
                policyType: 'MeshGatewayRoute',
                policy: route.route,
              },
            },
            service: destination.tags['kuma.io/service'],
            policies,
          }

          routeEntries.push(routeEntry)
        }

        meshGatewayListenerEntries.push({
          protocol: listener.protocol,
          port: listener.port,
          hostName: host.hostName,
          routeEntries,
        })
      }
    }
  }

  return meshGatewayListenerEntries
}

function getPolicyRoutes(policies: Record<string, MatchedPolicyType> | undefined): MeshGatewayRoutePolicy[] {
  if (policies === undefined) {
    return []
  }

  const policyRoutes: MeshGatewayRoutePolicy[] = []

  for (const policy of Object.values(policies)) {
    policyRoutes.push({
      type: policy.type,
      name: policy.name,
      route: {
        name: 'policy-detail-view',
        params: {
          mesh: policy.mesh,
          policyType: policy.type,
          policy: policy.name,
        },
      },
    })
  }

  return policyRoutes
}

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

      for (const policy of policies) {
        const connections = getPolicyTypeEntryConnections(policy, sidecarDataplane, destinationTags, name)

        policyTypeEntry.connections.push(...connections)
      }
    }
  }

  const policyTypeEntries = Array.from(policyTypeEntriesByType.values())

  policyTypeEntries.sort((policyTypeEntryA, policyTypeEntryB) => policyTypeEntryA.type.localeCompare(policyTypeEntryB.type))

  return policyTypeEntries
}

function getPolicyTypeEntryConnections(policy: MatchedPolicyType, sidecarDataplane: SidecarDataplane, destinationTags: LabelValue[], name: string | null): PolicyTypeEntryConnection[] {
  const config = policy.conf && Object.keys(policy.conf).length > 0 ? toYaml(policy.conf) : null
  const origin: PolicyTypeEntryOrigin = {
    name: policy.name,
    route: {
      name: 'policy-detail-view',
      params: {
        mesh: policy.mesh,
        policyType: policy.type,
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
    const connections = getRuleEntryConnections(rule)

    policyTypeEntry.connections.push(...connections)
  }

  const policyTypeEntries = Array.from(policyTypeEntriesByType.values())

  policyTypeEntries.sort((policyTypeEntryA, policyTypeEntryB) => policyTypeEntryA.type.localeCompare(policyTypeEntryB.type))

  return policyTypeEntries
}

function getRuleEntryConnections(rule: DataplaneRule): RuleEntryConnection[] {
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
          policyType: rule.policyType,
          policy: ruleOrigin.name,
        },
      },
    })
  }

  const connection: RuleEntryConnection = { type: { sourceTags, destinationTags }, addresses, config, origins }

  return [connection]
}
</script>

<style lang="scss" scoped>
.policies-list {
  padding: var(--spacing-sm);
}
</style>
