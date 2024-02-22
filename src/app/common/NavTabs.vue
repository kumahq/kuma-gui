<template>
  <KTabs
    :tabs="tabs"
    :model-value="props.activeRouteName ? '#' + props.activeRouteName : tabs[0].hash"
    hide-panels
  >
    <template
      v-for="tab in tabs"
      :key="tab.title"
      #[`${tab.title}-anchor`]
    >
      <slot :name="tab.title" />
    </template>
  </KTabs>
</template>

<script lang="ts" setup>
import { computed, useSlots } from 'vue'

import type { Tab } from '@kong/kongponents'

const slots = useSlots()

const props = defineProps<{
  activeRouteName?: string
}>()

const tabs = computed<Tab[]>(() => Object.keys(slots).map((title) => ({
  title,
  hash: '#' + title,
})))
</script>
