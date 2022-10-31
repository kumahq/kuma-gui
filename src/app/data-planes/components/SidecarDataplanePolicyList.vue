<template>
  <AccordionList
    :initially-open="[]"
    multiple-open
  >
    <AccordionItem
      v-for="(dataplanePolicy, index) in props.sidecarDataplanePolicies"
      :key="index"
    >
      <template #accordion-header>
        <div class="dataplane-policy-header">
          <div>
            <p>
              <template v-if="dataplanePolicy.type === 'dataplane'">
                Dataplane
              </template>

              <template v-else>
                {{ dataplanePolicy.service }}
              </template>
            </p>

            <p class="dataplane-policy-subtitle">
              <template v-if="dataplanePolicy.type === 'inbound' || dataplanePolicy.type === 'outbound'">
                {{ dataplanePolicy.type }} {{ dataplanePolicy.name }}
              </template>

              <template v-else-if="dataplanePolicy.type === 'service' || dataplanePolicy.type === 'dataplane'">
                {{ dataplanePolicy.type }}
              </template>

              <KPop
                width="300"
                placement="right"
                trigger="hover"
              >
                <KIcon
                  icon="help"
                  size="16"
                  class="ml-1"
                />

                <template #content>
                  {{ POLICY_TYPE_SUBTITLE[dataplanePolicy.type] }}
                </template>
              </KPop>
            </p>
          </div>

          <div
            v-if="dataplanePolicy.matchedPolicies.length > 0"
            class="badge-list"
          >
            <KBadge
              v-for="(matchedPolicy, matchPolicyIndex) in dataplanePolicy.matchedPolicies"
              :key="`${index}-${matchPolicyIndex}`"
            >
              {{ matchedPolicy.name }}
            </KBadge>
          </div>
        </div>
      </template>

      <template
        v-if="dataplanePolicy.matchedPolicies.length > 0"
        #accordion-content
      >
        <div class="policy-wrapper">
          <div
            v-for="(matchedPolicy, matchPolicyIndex) in dataplanePolicy.matchedPolicies"
            :key="`${index}-${matchPolicyIndex}`"
          >
            <p class="policy-type">
              {{ matchedPolicy.pluralName }}
            </p>

            <ul v-if="matchedPolicy.policies.length > 0">
              <li
                v-for="(policy, policyIndex) in matchedPolicy.policies"
                :key="`${index}-${matchPolicyIndex}-${policyIndex}`"
                data-testid="policy-name"
              >
                <router-link :to="policy.route">
                  {{ policy.name }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </AccordionItem>
  </AccordionList>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { KPop, KIcon, KBadge } from '@kong/kongponents'

import AccordionList from '@/app/common/AccordionList.vue'
import AccordionItem from '@/app/common/AccordionItem.vue'
import { SidecarDataplanePolicy } from '@/types/index.d'

const POLICY_TYPE_SUBTITLE: Record<string, string> = {
  inbound: 'Policies applied on incoming connection on address',
  outbound: 'Policies applied on outgoing connection to the address',
  service: 'Policies applied on outgoing connections to service',
  dataplane: 'Policies applied on all incoming and outgoing connections to the selected data plane proxy',
}

const props = defineProps({
  sidecarDataplanePolicies: {
    type: Array as PropType<SidecarDataplanePolicy[]>,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.dataplane-policy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dataplane-policy-subtitle {
  display: flex;
  align-items: center;
  font-size: var(--type-sm);
  color: var(--black-45);
}

.badge-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.policy-type {
  margin-bottom: var(--spacing-xs);
  text-transform: uppercase;
  font-size: var(--type-sm);
  font-weight: 500;
  color: var(--gray-3);
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
</style>
