<template>
  <div class="policies-list">
    <div class="mesh-gateway-policy-list">
      <h3 class="mb-2">
        Gateway policies
      </h3>

      <ul v-if="meshGatewayRoutePolicies.length > 0">
        <li
          v-for="(policy, index) in meshGatewayRoutePolicies"
          :key="index"
        >
          <span>{{ policy.type }}</span>:

          <router-link :to="policy.route">{{ policy.name }}</router-link>
        </li>
      </ul>

      <h3 class="mt-6 mb-2">
        Listeners
      </h3>

      <div>
        <div
          v-for="(listenerEntry, index) in meshGatewayListenerEntries"
          :key="index"
        >
          <div>
            <div>
              <b>Host</b>: {{ listenerEntry.hostName }}:{{ listenerEntry.port }} ({{ listenerEntry.protocol }})
            </div>

            <template v-if="listenerEntry.routeEntries.length > 0">
              <h4 class="mt-2 mb-2">
                Routes
              </h4>

              <AccordionList
                :initially-open="[]"
                multiple-open
              >
                <AccordionItem
                  v-for="(routeEntry, routeIndex) in listenerEntry.routeEntries"
                  :key="routeIndex"
                >
                  <template #accordion-header>
                    <div class="dataplane-policy-header">
                      <div>
                        <div>
                          <b>Route</b>: <router-link :to="routeEntry.route">{{ routeEntry.routeName }}</router-link>
                        </div>

                        <div>
                          <b>Service</b>: {{ routeEntry.service }}
                        </div>
                      </div>

                      <div
                        v-if="routeEntry.policies.length > 0"
                        class="badge-list"
                      >
                        <KBadge
                          v-for="(policy, policyIndex) in routeEntry.policies"
                          :key="`${index}-${policyIndex}`"
                        >
                          {{ policy.type }}
                        </KBadge>
                      </div>
                    </div>
                  </template>

                  <template
                    v-if="routeEntry.policies.length > 0"
                    #accordion-content
                  >
                    <ul class="mt-1">
                      <li
                        v-for="(policy, policyIndex) in routeEntry.policies"
                        :key="`${index}-${policyIndex}`"
                      >
                        {{ policy.type }}:

                        <router-link :to="policy.route">{{ policy.name }}</router-link>
                      </li>
                    </ul>
                  </template>
                </AccordionItem>
              </AccordionList>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import type { MatchedPolicyType, MeshGatewayDataplane, MeshGatewayListenerEntry, MeshGatewayRouteEntry, MeshGatewayRoutePolicy, PolicyType } from '@/types/index.d'

const props = defineProps<{
  gatewayDataplane: MeshGatewayDataplane
  policyTypesByName: Record<string, PolicyType | undefined>
}>()

const meshGatewayListenerEntries = computed(() => getMeshGatewayListenerEntries(props.gatewayDataplane))
const meshGatewayRoutePolicies = computed(() => getPolicyRoutes(props.gatewayDataplane.policies))

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
                policyPath: 'meshgatewayroutes',
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
    const policyType = props.policyTypesByName[policy.type] as PolicyType

    policyRoutes.push({
      type: policy.type,
      name: policy.name,
      route: {
        name: 'policy-detail-view',
        params: {
          mesh: policy.mesh,
          policyPath: policyType.path,
          policy: policy.name,
        },
      },
    })
  }

  return policyRoutes
}
</script>

<style lang="scss" scoped>
.policies-list {
  padding: $kui-space-50;
}

.dataplane-policy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: $kui-space-40;
}
</style>

<style lang="scss">
.mesh-gateway-policy-list .accordion-item-header {
  padding-left: 0;
  padding-top: $kui-space-40;
  padding-bottom: $kui-space-40;
}
</style>
