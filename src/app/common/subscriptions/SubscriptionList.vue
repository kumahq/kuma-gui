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
        <SubscriptionDetails :subscription="subscription" />
      </template>
    </AccordionItem>
  </AccordionList>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import AccordionItem from '@/app/common/AccordionItem.vue'
import AccordionList from '@/app/common/AccordionList.vue'
import SubscriptionDetails from '@/app/common/subscriptions/SubscriptionDetails.vue'
import SubscriptionHeader from '@/app/common/subscriptions/SubscriptionHeader.vue'
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
