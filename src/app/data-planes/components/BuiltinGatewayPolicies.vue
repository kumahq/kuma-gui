<template>
  <div
    class="policies-list"
    data-testid="builtin-gateway-dataplane-policies"
  >
    <div class="mesh-gateway-policy-list">
      <h3 class="mb-2">
        Gateway policies
      </h3>

      <ul v-if="gatewayDataplane.routePolicies.length > 0">
        <li
          v-for="(policy, index) in gatewayDataplane.routePolicies"
          :key="index"
        >
          <span>{{ policy.type }}</span>:

          <RouterLink
            :to="{
              name: 'policy-detail-view',
              params: {
                mesh: policy.mesh,
                policyPath: props.policyTypesByName[policy.type]!.path,
                policy: policy.name,
              },
            }"
          >
            {{ policy.name }}
          </RouterLink>
        </li>
      </ul>

      <h3 class="mt-6 mb-2">
        Listeners
      </h3>

      <div>
        <div
          v-for="(listenerEntry, index) in gatewayDataplane.listenerEntries"
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
                          <b>Route</b>: <RouterLink
                            :to="{
                              name: 'policy-detail-view',
                              params: {
                                mesh: routeEntry.route.mesh,
                                policyPath: props.policyTypesByName[routeEntry.route.type]!.path,
                                policy: routeEntry.route.name,
                              },
                            }"
                          >
                            {{ routeEntry.route.name }}
                          </RouterLink>
                        </div>

                        <div>
                          <b>Service</b>: {{ routeEntry.service }}
                        </div>
                      </div>

                      <div
                        v-if="routeEntry.origins.length > 0"
                        class="badge-list"
                      >
                        <KBadge
                          v-for="(policy, policyIndex) in routeEntry.origins"
                          :key="`${index}-${policyIndex}`"
                        >
                          {{ policy.type }}
                        </KBadge>
                      </div>
                    </div>
                  </template>

                  <template
                    v-if="routeEntry.origins.length > 0"
                    #accordion-content
                  >
                    <ul class="mt-1">
                      <li
                        v-for="(policy, policyIndex) in routeEntry.origins"
                        :key="`${index}-${policyIndex}`"
                      >
                        {{ policy.type }}:

                        <RouterLink
                          :to="{
                            name: 'policy-detail-view',
                            params: {
                              mesh: policy.mesh,
                              policyPath: props.policyTypesByName[policy.type]!.path,
                              policy: policy.name,
                            },
                          }"
                        >
                          {{ policy.name }}
                        </RouterLink>
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
import type { MeshGatewayDataplane } from '../data'
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import type { PolicyType } from '@/types/index.d'

const props = defineProps<{
  gatewayDataplane: MeshGatewayDataplane
  policyTypesByName: Record<string, PolicyType | undefined>
}>()
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
