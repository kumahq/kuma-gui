<template>
  <div class="stack">
    <KCard v-if="props.inspectRulesForDataplane.proxyRules.length > 0">
      <h3>{{ t('data-planes.routes.item.proxy_rule') }}</h3>

      <RuleEntryList
        id="proxy-rules"
        class="mt-2"
        :rule-entries="props.inspectRulesForDataplane.proxyRules"
        :policy-types-by-name="props.policyTypesByName"
        :show-matchers="false"
        data-testid="proxy-rule-list"
      />
    </KCard>

    <KCard v-if="props.inspectRulesForDataplane.toRules.length > 0">
      <h3>{{ t('data-planes.routes.item.to_rules') }}</h3>

      <RuleEntryList
        id="to-rules"
        class="mt-2"
        :rule-entries="props.inspectRulesForDataplane.toRules"
        :policy-types-by-name="props.policyTypesByName"
        data-testid="to-rule-list"
      />
    </KCard>

    <KCard v-if="props.inspectRulesForDataplane.fromRuleInbounds.length > 0">
      <h3 class="mb-2">
        {{ t('data-planes.routes.item.from_rules') }}
      </h3>

      <div
        v-for="(fromRule, index) in props.inspectRulesForDataplane.fromRuleInbounds"
        :key="index"
      >
        <h4>{{ t('data-planes.routes.item.port', { port: fromRule.port }) }}</h4>

        <RuleEntryList
          :id="`from-rules-${index}`"
          class="mt-2"
          :rule-entries="fromRule.ruleEntries"
          :policy-types-by-name="props.policyTypesByName"
          :data-testid="`from-rule-list-${index}`"
        />
      </div>
    </KCard>

    <div
      v-if="props.showLegacyPolicies"
      data-testid="legacy-policies"
    >
      <h3>{{ t('data-planes.routes.item.legacy_policies') }}</h3>

      <KCard class="mt-4">
        <PolicyTypeEntryList
          v-if="props.policyTypeEntries.length > 0"
          id="policies"
          :policy-type-entries="props.policyTypeEntries"
          :policy-types-by-name="props.policyTypesByName"
          data-testid="sidecar-dataplane-policies"
        />

        <BuiltinGatewayPolicies
          v-if="props.gatewayDataplane !== undefined"
          :policy-types-by-name="props.policyTypesByName"
          :gateway-dataplane="props.gatewayDataplane"
          data-testid="builtin-gateway-dataplane-policies"
        />
      </KCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PolicyTypeEntryList from './PolicyTypeEntryList.vue'
import RuleEntryList from './RuleEntryList.vue'
import BuiltinGatewayPolicies from '../components/BuiltinGatewayPolicies.vue'
import type { InspectRulesForDataplane, MeshGatewayDataplane } from '../data'
import { useI18n } from '@/app/application'
import type { PolicyType, PolicyTypeEntry } from '@/types/index.d'

const { t } = useI18n()

const props = defineProps<{
  policyTypeEntries: PolicyTypeEntry[]
  gatewayDataplane: MeshGatewayDataplane | undefined
  inspectRulesForDataplane: InspectRulesForDataplane
  policyTypesByName: Record<string, PolicyType | undefined>
  showLegacyPolicies: boolean
}>()
</script>
