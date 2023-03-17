<template>
  <div class="mesh-gateway-policy-list">
    <h3>Gateway policies</h3>

    <ul
      v-if="meshGatewayRoutePolicies.length > 0"
      class="policy-list"
    >
      <li
        v-for="(policy, index) in meshGatewayRoutePolicies"
        :key="index"
      >
        <span>{{ policy.type }}</span>:

        <router-link :to="policy.route">{{ policy.name }}</router-link>
      </li>
    </ul>

    <h3 class="mt-6">
      Listeners
    </h3>

    <div>
      <div
        v-for="(listenerEntry, index) in props.meshGatewayListenerEntries"
        :key="index"
      >
        <div>
          <div>
            <b>Host</b>: {{ listenerEntry.hostName }}:{{ listenerEntry.port }} ({{ listenerEntry.protocol }})
          </div>

          <template v-if="listenerEntry.routeEntries.length > 0">
            <h4 class="mt-2">
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
                  <ul class="policy-list mt-1">
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
</template>

<script lang="ts" setup>
import { KBadge } from '@kong/kongponents'
import { PropType } from 'vue'

import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import { MeshGatewayDataplane, MeshGatewayListenerEntry, MeshGatewayRoutePolicy } from '@/types/index.d'

const props = defineProps({
  meshGatewayDataplane: {
    type: Object as PropType<MeshGatewayDataplane>,
    required: true,
  },

  meshGatewayListenerEntries: {
    type: Array as PropType<MeshGatewayListenerEntry[]>,
    required: true,
  },

  meshGatewayRoutePolicies: {
    type: Array as PropType<MeshGatewayRoutePolicy[]>,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
h3, h4 {
  margin-bottom: var(--spacing-xs);
}

.policy-list {
  padding-left: 1.5rem;
  list-style: disc;
}

.dataplane-policy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-list {
  display: inline-flex;
  gap: var(--spacing-sm);
}

.badge-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.policy-wrapper {
  --columns: 2;
  display: grid;
  gap: var(--spacing-sm);
  grid-template-columns: repeat(var(--columns), 1fr);

  @media (min-width: 1270px) {
    --columns: 4;
  }
}

.policy-type {
  margin-bottom: var(--spacing-xs);
  text-transform: uppercase;
  font-size: var(--type-sm);
  font-weight: 600;
  color: var(--grey-500);
}
</style>

<style lang="scss">
.mesh-gateway-policy-list .accordion-item-header {
  padding-left: 0;
  padding-top: var(--spacing-xs);
  padding-bottom: var(--spacing-xs);
}
</style>
