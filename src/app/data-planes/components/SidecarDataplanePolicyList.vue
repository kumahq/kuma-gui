<template>
  <h2 class="kutil-sr-only">
    Policies
  </h2>

  <PolicyTypeEntryList
    id="policies"
    :policy-type-entries="props.policyTypeEntries"
  />

  <div
    v-if="policyTypeEntriesFromRules.length > 0"
    class="mt-2"
  >
    <h2>Rules</h2>

    <PolicyTypeEntryList
      id="rules"
      :policy-type-entries="props.policyTypeEntriesFromRules"
    />
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

import PolicyTypeEntryList from './PolicyTypeEntryList.vue'
import { PolicyTypeEntry } from '@/types/index.d'

const props = defineProps({
  dppName: {
    type: String,
    required: true,
  },

  policyTypeEntries: {
    type: Object as PropType<PolicyTypeEntry[]>,
    required: true,
  },

  policyTypeEntriesFromRules: {
    type: Array as PropType<PolicyTypeEntry[]>,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
h2 {
  margin-bottom: var(--spacing-xs);
}

h2 {
  font-size: 1.5em;
}
</style>
