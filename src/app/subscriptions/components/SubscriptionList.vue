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
import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import type { DiscoverySubscription, KDSSubscription } from '@/types/index.d'

const props = defineProps<{
  subscriptions: Array<KDSSubscription | DiscoverySubscription>
}>()

const reversedSubscriptions = computed(() => {
  const reversedSubscriptions = Array.from(props.subscriptions)

  reversedSubscriptions.reverse()

  return reversedSubscriptions
})
</script>
