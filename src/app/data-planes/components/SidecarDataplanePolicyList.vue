<template>
  <h2 class="visually-hidden">
    Policies
  </h2>

  <PolicyTypeEntryList
    id="policies"
    :policy-type-entries="props.policyTypeEntries"
    data-testid="policy-list"
  />

  <div
    v-if="ruleEntries.length > 0"
    class="mt-2"
  >
    <h2 class="mb-2">
      Rules
    </h2>

    <RuleEntryList
      id="rules"
      :rule-entries="props.ruleEntries"
      data-testid="rule-list"
    />
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

import PolicyTypeEntryList from './PolicyTypeEntryList.vue'
import RuleEntryList from './RuleEntryList.vue'
import { PolicyTypeEntry, RuleEntry } from '@/types/index.d'

const props = defineProps({
  dppName: {
    type: String,
    required: true,
  },

  policyTypeEntries: {
    type: Object as PropType<PolicyTypeEntry[]>,
    required: true,
  },

  ruleEntries: {
    type: Array as PropType<RuleEntry[]>,
    required: true,
  },
})
</script>
