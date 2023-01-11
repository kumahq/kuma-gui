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
      :dpp-name="dataPlane.name"
      :policy-type-entries="policyTypeEntries"
      :policy-type-entries-from-rules="policyTypeEntriesFromRules"
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
import json2yaml from '@appscode/json2yaml'

import { useStore } from '@/store/store'
import { kumaApi } from '@/api/kumaApi'
import SidecarDataplanePolicyList from './SidecarDataplanePolicyList.vue'
import MeshGatewayDataplanePolicyList from './MeshGatewayDataplanePolicyList.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'

import {
  DataPlane,
  DataplaneRule,
  LabelValue,
  MeshGatewayDataplane,
  MeshGatewayListenerEntry,
  MeshGatewayRouteEntry,
  MeshGatewayRoutePolicy,
  PolicyDefinition,
  PolicyType,
  PolicyTypeEntry,
  PolicyTypeEntryConnection,
  PolicyTypeEntryOrigin,
  SidecarDataplane,
} from '@/types/index.d'

const store = useStore()

const props = defineProps({
  dataPlane: {
    type: Object as PropType<DataPlane>,
    required: true,
  },
})

const meshGatewayDataplane = ref<MeshGatewayDataplane | null>(null)
const policyTypeEntries = ref<PolicyTypeEntry[]>([])
const policyTypeEntriesFromRules = ref<PolicyTypeEntry[]>([])
const meshGatewayListenerEntries = ref<MeshGatewayListenerEntry[]>([])
const meshGatewayRoutePolicies = ref<MeshGatewayRoutePolicy[]>([])
const isLoading = ref(true)
const error = ref<Error | null>(null)

watch(() => props.dataPlane.name, function () {
  fetchPolicies()
})

fetchPolicies()

async function fetchPolicies(): Promise<void> {
  error.value = null
  isLoading.value = true
  policyTypeEntries.value = []
  policyTypeEntriesFromRules.value = []
  meshGatewayListenerEntries.value = []
  meshGatewayRoutePolicies.value = []

  try {
    const isMeshGatewayDataplane = props.dataPlane.networking.gateway?.type?.toUpperCase() === 'BUILTIN'

    if (isMeshGatewayDataplane) {
      meshGatewayDataplane.value = await kumaApi.getMeshGatewayDataplane({
        mesh: props.dataPlane.mesh,
        name: props.dataPlane.name,
      })

      meshGatewayListenerEntries.value = getMeshGatewayListenerEntries(meshGatewayDataplane.value)
      meshGatewayRoutePolicies.value = getPolicyRoutes(meshGatewayDataplane.value.policies)
    } else {
      const { items: sidecarDataplanes } = await kumaApi.getSidecarDataplanePolicies({
        mesh: props.dataPlane.mesh,
        name: props.dataPlane.name,
      })

      policyTypeEntries.value = getPolicyTypeEntries(sidecarDataplanes ?? [])

      const { items: rules } = await kumaApi.getDataplaneRules({
        mesh: props.dataPlane.mesh,
        name: props.dataPlane.name,
      })

      policyTypeEntriesFromRules.value = getPolicyTypeEntriesFromRules(rules ?? [])
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

  for (const listener of meshGatewayDataplane.listeners) {
    for (const host of listener.hosts) {
      for (const route of host.routes) {
        const routeEntries: MeshGatewayRouteEntry[] = []

        for (const destination of route.destinations) {
          const policies = getPolicyRoutes(destination.policies)

          const routeEntry: MeshGatewayRouteEntry = {
            routeName: route.route,
            route: {
              name: 'meshgatewayroutes',
              params: { mesh: meshGatewayDataplane.gateway.mesh },
              query: { ns: route.route },
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

function getPolicyRoutes(policies: Record<string, PolicyType> | undefined): MeshGatewayRoutePolicy[] {
  if (policies === undefined) {
    return []
  }

  const policyRoutes: MeshGatewayRoutePolicy[] = []

  for (const policy of Object.values(policies)) {
    const policyDefinition = store.state.policiesByType[policy.type]

    policyRoutes.push({
      type: policy.type,
      name: policy.name,
      route: {
        name: 'policy',
        params: {
          mesh: policy.mesh,
          policyPath: policyDefinition.path,
        },
        query: { ns: policy.name },
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
  const policyEntriesByType = new Map<string, PolicyTypeEntry>()

  for (const sidecarDataplane of sidecarDataplanes) {
    const { type, service } = sidecarDataplane

    // The `service` field, when set, represents the name of the destination service of traffic.
    const destinationTags: LabelValue[] | null = typeof service === 'string' && service !== '' ? [{ label: 'kuma.io/service', value: service }] : null
    const name = type === 'inbound' || type === 'outbound' ? sidecarDataplane.name : null

    for (const [policyType, policies] of Object.entries(sidecarDataplane.matchedPolicies)) {
      if (!policyEntriesByType.has(policyType)) {
        policyEntriesByType.set(policyType, {
          type: policyType,
          connections: [],
        })
      }

      const policyEntry = policyEntriesByType.get(policyType) as PolicyTypeEntry
      const policyDefinition = store.state.policiesByType[policyType]

      for (const policy of policies) {
        const connections = getPolicyEntryConnections(policy, policyDefinition, sidecarDataplane, destinationTags, name)

        policyEntry.connections.push(...connections)
      }
    }
  }

  const policyTypeEntries = Array.from(policyEntriesByType.values())

  policyTypeEntries.sort((policyEntryA, policyEntryB) => policyEntryA.type.localeCompare(policyEntryB.type))

  return policyTypeEntries
}

function getPolicyEntryConnections(policy: PolicyType, policyDefinition: PolicyDefinition, sidecarDataplane: SidecarDataplane, destinationTags: LabelValue[] | null, name: string | null): PolicyTypeEntryConnection[] {
  const config = policy.conf && Object.keys(policy.conf).length > 0 ? json2yaml(JSON.stringify(policy.conf, null, 2)) : null
  const origin: PolicyTypeEntryOrigin = {
    name: policy.name,
    route: {
      name: 'policy',
      query: { ns: policy.name },
      params: {
        mesh: policy.mesh,
        policyPath: policyDefinition.path,
      },
    },
  }
  const origins: PolicyTypeEntryOrigin[] = [origin]

  const policyEntryConnections: PolicyTypeEntryConnection[] = []

  if (sidecarDataplane.type === 'inbound' && Array.isArray(policy.sources)) {
    for (const { match } of policy.sources) {
      const sourceTags: LabelValue[] = [{ label: 'kuma.io/service', value: match['kuma.io/service'] }]
      const connection: PolicyTypeEntryConnection = { sourceTags, destinationTags, name, config, origins }

      policyEntryConnections.push(connection)
    }
  } else {
    const sourceTags = null
    const connection: PolicyTypeEntryConnection = { sourceTags, destinationTags, name, config, origins }

    policyEntryConnections.push(connection)
  }

  return policyEntryConnections
}

/**
 * Transforms `DataplaneRule` objects into policy type entries which are going to be displayed in this view.
 */
function getPolicyTypeEntriesFromRules(rules: DataplaneRule[]): PolicyTypeEntry[] {
  // Uses a `Map` to store entries by type so they can be retrieved and updated while iterating over the rules.
  const policyEntriesByType = new Map<string, PolicyTypeEntry>()

  for (const rule of rules) {
    if (!policyEntriesByType.has(rule.policyType)) {
      policyEntriesByType.set(rule.policyType, {
        type: rule.policyType,
        connections: [],
      })
    }

    const policyEntry = policyEntriesByType.get(rule.policyType) as PolicyTypeEntry
    const policyDefinition = store.state.policiesByType[rule.policyType]
    const connections = getPolicyEntryConnectionsFromRules(rule, policyDefinition)

    policyEntry.connections.push(...connections)
  }

  const policyTypeEntries = Array.from(policyEntriesByType.values())

  policyTypeEntries.sort((policyEntryA, policyEntryB) => policyEntryA.type.localeCompare(policyEntryB.type))

  return policyTypeEntries
}

function getPolicyEntryConnectionsFromRules(rule: DataplaneRule, policyDefinition: PolicyDefinition): PolicyTypeEntryConnection[] {
  const { type, service, subset, conf } = rule

  // Guards against likely API changes. The response currently contains `"subset": {}` instead of omitting the value or setting it to `null`, but that might change in the future.
  const subsetEntries = subset ? Object.entries(subset) : []
  let sourceTags: LabelValue[] | null
  let destinationTags: LabelValue[] | null

  if (type === 'clientSubset') {
    // Sets the wildcard service tag for client subsets without subset values.
    const sourceSubset = subsetEntries.length > 0 ? subsetEntries : [['kuma.io/service', '*']]
    // For client subsets, the source is represented by `subset` (i.e. tags); for destination subsets and single items, the source is the DPP.
    sourceTags = sourceSubset.length > 0 ? sourceSubset.map(([label, value]) => ({ label, value })) : null
  } else {
    sourceTags = null
  }

  if (typeof service === 'string' && service !== '') {
    // The `service` field, when set, represents the name of the destination service of traffic.
    const destinationSubset = [['kuma.io/service', service]]
    destinationTags = destinationSubset.length > 0 ? destinationSubset.map(([label, value]) => ({ label, value })) : null
  } else if (type === 'destinationSubset') {
    // For client subsets and destination subsets, the destination is `service`; for single items, the destination is the DPP.
    // For destination subsets with empty or absent `subset` field, we can set the wildcard service tag to indicate that the traffic goes to all services.
    const destinationSubset: [string, string][] = subsetEntries.length > 0 ? subsetEntries : [['kuma.io/service', '*']]
    destinationTags = destinationSubset.length > 0 ? destinationSubset.map(([label, value]) => ({ label, value })) : null
  } else {
    destinationTags = null
  }

  const name = type === 'clientSubset' || type === 'destinationSubset' || service ? rule.name : null
  const config = conf && Object.keys(conf).length > 0 ? json2yaml(JSON.stringify(conf, null, 2)) : null
  const origins: PolicyTypeEntryOrigin[] = []

  for (const ruleOrigin of rule.origins) {
    origins.push({
      name: ruleOrigin.name,
      route: {
        name: 'policy',
        query: { ns: ruleOrigin.name },
        params: {
          mesh: ruleOrigin.mesh,
          policyPath: policyDefinition.path,
        },
      },
    })
  }

  const connection: PolicyTypeEntryConnection = { sourceTags, destinationTags, name, config, origins }

  return [connection]
}
</script>

<style lang="scss" scoped>
.policies-list {
  padding: var(--spacing-sm);
}
</style>
