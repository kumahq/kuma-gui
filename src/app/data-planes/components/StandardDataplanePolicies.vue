<template>
  <div class="stack">
    <KCard v-if="props.inspectRulesForDataplane.proxyRules.length > 0">
      <h3>{{ t('data-planes.routes.item.proxy_rule') }}</h3>

      <RuleEntryList
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
          class="mt-2"
          :rule-entries="fromRule.ruleEntries"
          :policy-types-by-name="props.policyTypesByName"
          :data-testid="`from-rule-list-${index}`"
        />
      </div>
    </KCard>
  </div>
</template>

<script lang="ts" setup>
import RuleEntryList from './RuleEntryList.vue'
import type { InspectRulesForDataplane } from '../data'
import { useI18n } from '@/app/application'
import type { PolicyType } from '@/types/index.d'

const { t } = useI18n()

const props = defineProps<{
  inspectRulesForDataplane: InspectRulesForDataplane
  policyTypesByName: Record<string, PolicyType | undefined>
}>()
</script>
