<template>
  <LoadingBlock v-if="isLoading" />

  <ErrorBlock
    v-else-if="error !== null"
    :error="error"
  />

  <div
    v-else-if="sidecarDataplanePolicies.length > 0"
    class="policies-list"
  >
    <SidecarDataplanePolicyList :sidecar-dataplane-policies="sidecarDataplanePolicies" />
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

import { useStore } from '@/store/store'
import Kuma from '@/services/kuma'
import SidecarDataplanePolicyList from './SidecarDataplanePolicyList.vue'
import MeshGatewayDataplanePolicyList from './MeshGatewayDataplanePolicyList.vue'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'

import { DataPlane, MeshGatewayDataplane, MeshGatewayListenerEntry, MeshGatewayRouteEntry, MeshGatewayRoutePolicy, PolicyType, SidecarDataplane, SidecarDataplaneMatchedPolicy, SidecarDataplanePolicy } from '@/types'

const store = useStore()

const props = defineProps({
  dataPlane: {
    type: Object as PropType<DataPlane>,
    required: true,
  },
})

const meshGatewayDataplane = ref<MeshGatewayDataplane | null>(null)
const sidecarDataplanePolicies = ref<SidecarDataplanePolicy[]>([])
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
  sidecarDataplanePolicies.value = []
  meshGatewayListenerEntries.value = []
  meshGatewayRoutePolicies.value = []

  try {
    const isMeshGatewayDataplane = props.dataPlane.networking.gateway?.type?.toUpperCase() === 'BUILTIN'

    if (isMeshGatewayDataplane) {
      meshGatewayDataplane.value = await Kuma.getMeshGatewayDataplane({
        mesh: props.dataPlane.mesh,
        name: props.dataPlane.name,
      })

      meshGatewayListenerEntries.value = getMeshGatewayListenerEntries(meshGatewayDataplane.value)
      meshGatewayRoutePolicies.value = getPolicyRoutes(meshGatewayDataplane.value.policies)
    } else {
      const { items } = await Kuma.getSidecarDataplanePolicies({
        mesh: props.dataPlane.mesh,
        name: props.dataPlane.name,
      })

      sidecarDataplanePolicies.value = getDataplanePoliciesFromSidecarDataplanes(items)
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
        name: policyDefinition.path,
        params: { mesh: policy.mesh },
        query: { ns: policy.name },
      },
    })
  }

  return policyRoutes
}

function getDataplanePoliciesFromSidecarDataplanes(sidecarDataplanes: SidecarDataplane[]): SidecarDataplanePolicy[] {
  const dataplanePolicies: SidecarDataplanePolicy[] = []

  for (const sidecarDataplane of sidecarDataplanes) {
    const processedMatchedPolicies: SidecarDataplaneMatchedPolicy[] = []

    for (const [policyType, matchedPolicies] of Object.entries(sidecarDataplane.matchedPolicies)) {
      const policyDefinition = store.state.policiesByType[policyType]
      const policies: Array<{ name: string, route: any }> = []

      for (const matchedPolicy of matchedPolicies) {
        policies.push({
          name: matchedPolicy.name,
          route: {
            name: policyDefinition.path,
            query: { ns: matchedPolicy.name },
            params: { mesh: matchedPolicy.mesh },
          },
        })
      }

      processedMatchedPolicies.push({
        name: policyType,
        pluralName: policyDefinition.pluralDisplayName,
        policies,
      })
    }

    const { name, type, service } = sidecarDataplane
    dataplanePolicies.push({
      name,
      type,
      service,
      matchedPolicies: processedMatchedPolicies,
    })
  }

  return dataplanePolicies
}
</script>

<style lang="scss" scoped>
.policies-list {
  padding: var(--spacing-sm);
}
</style>
