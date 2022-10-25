<template>
  <AccordionList multiple-open>
    <AccordionItem
      v-for="item in store.getters['notifications/singleMeshNotificationItems']"
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
          :is="componentMap[item.component]"
          v-if="item.component"
        />

        <KCard v-else>
          <template #body>
            {{ item.content }}
          </template>
        </KCard>
      </template>
    </AccordionItem>
  </AccordionList>
</template>

<script lang="ts" setup>
import { KCard, KIcon } from '@kong/kongponents'

import { useStore } from '@/store/store'
import AccordionList from '@/app/common/AccordionList.vue'
import AccordionItem from '@/app/common/AccordionItem.vue'
import LoggingNotification from './LoggingNotification.vue'
import MetricsNotification from './MetricsNotification.vue'
import MtlsNotification from './MtlsNotification.vue'
import TracingNotification from './TracingNotification.vue'

const store = useStore()

const componentMap: Record<string, any> = {
  LoggingNotification,
  MetricsNotification,
  MtlsNotification,
  TracingNotification,
}
</script>
