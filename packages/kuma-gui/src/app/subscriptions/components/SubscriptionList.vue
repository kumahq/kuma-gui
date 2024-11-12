<template>
  <AccordionList>
    <AccordionItem
      v-for="(subscription, index) in reversedSubscriptions"
      :key="index"
    >
      <template #accordion-header>
        <SubscriptionHeader :subscription="subscription" />
      </template>

      <template #accordion-content>
        <SubscriptionDetails
          :subscription="subscription"
        >
          <template
            v-if="$slots.default"
          >
            <slot name="default" />
          </template>
        </SubscriptionDetails>
      </template>
    </AccordionItem>
  </AccordionList>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import SubscriptionDetails from './SubscriptionDetails.vue'
import SubscriptionHeader from './SubscriptionHeader.vue'
import type { Subscription } from '../data'
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'

const props = defineProps<{
  subscriptions: Subscription[]
}>()

const reversedSubscriptions = computed(() => {
  const reversedSubscriptions = Array.from(props.subscriptions)

  reversedSubscriptions.reverse()

  return reversedSubscriptions
})
</script>
