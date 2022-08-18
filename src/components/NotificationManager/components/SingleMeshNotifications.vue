<template>
  <AccordionList multiple-open>
    <AccordionItem
      v-for="item in singleMeshNotificationItems"
      :key="item.name"
    >
      <template #accordion-header>
        <div class="flex items-center">
          <KIcon
            v-if="item.isCompleted"
            color="var(--green-400)"
            icon="check"
            size="20"
            class="mr-4"
          />
          <KIcon
            v-else
            icon="warning"
            color="var(--black-75)"
            secondary-color="var(--yellow-300)"
            size="20"
            class="mr-4"
          />
          <strong>{{ item.name }}</strong>
        </div>
      </template>

      <template #accordion-content>
        <component
          :is="item.component"
          v-if="item.component"
        />
        <template v-else>
          <KCard>
            <template #body>
              {{ item.content }}
            </template>
          </KCard>
        </template>
      </template>
    </AccordionItem>
  </AccordionList>
</template>

<script>
import { mapGetters } from 'vuex'

import OnboardingNotification from './OnboardingNotification.vue'
import LoggingNotification from './LoggingNotification.vue'
import MetricsNotification from './MetricsNotification.vue'
import MtlsNotification from './MtlsNotification.vue'
import TracingNotification from './TracingNotification.vue'
import AccordionList from '@/components/Accordion/AccordionList.vue'
import AccordionItem from '@/components/Accordion/AccordionItem.vue'

export default {
  name: 'SingleMeshNotifications',
  components: {
    AccordionList,
    AccordionItem,
    OnboardingNotification,
    LoggingNotification,
    MetricsNotification,
    MtlsNotification,
    TracingNotification,
  },
  computed: {
    ...mapGetters({
      singleMeshNotificationItems: 'notifications/singleMeshNotificationItems',
    }),
  },
}
</script>
