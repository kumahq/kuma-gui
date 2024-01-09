<template>
  <div
    data-testid="standard-dataplane-policies"
    class="stack"
  >
    <KCard v-if="(props.showLegacyPolicies ? props.policyTypeEntries.length === 0 : true) && props.inspectRulesForDataplane.rules.length === 0">
      <EmptyBlock />
    </KCard>

    <template v-else>
      <KCard v-if="props.inspectRulesForDataplane.proxyRule">
        <h3>{{ t('data-planes.routes.item.proxy_rule') }}</h3>

        <RuleEntryList
          id="proxy-rules"
          class="mt-2"
          :rule-entries="[props.inspectRulesForDataplane.proxyRule]"
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

      <div v-if="props.showLegacyPolicies">
        <h3>{{ t('data-planes.routes.item.legacy_policies') }}</h3>

        <KCard class="mt-4">
          <PolicyTypeEntryList
            id="policies"
            :policy-type-entries="props.policyTypeEntries"
            :policy-types-by-name="props.policyTypesByName"
            data-testid="policy-list"
          />
        </KCard>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import PolicyTypeEntryList from './PolicyTypeEntryList.vue'
import RuleEntryList from './RuleEntryList.vue'
import type { InspectRulesForDataplane } from '../data'
import { useI18n } from '@/app/application'
import EmptyBlock from '@/app/common/EmptyBlock.vue'
import type { PolicyType, PolicyTypeEntry } from '@/types/index.d'

const { t } = useI18n()

const props = defineProps<{
  policyTypeEntries: PolicyTypeEntry[]
  inspectRulesForDataplane: InspectRulesForDataplane
  policyTypesByName: Record<string, PolicyType | undefined>
  showLegacyPolicies: boolean
}>()
</script>
