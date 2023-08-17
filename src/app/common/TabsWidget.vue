<template>
  <KTabs
    v-model="activeTabHash"
    :tabs="tabs"
    @changed="switchTab"
  >
    <template
      v-for="(tab, index) in tabsSlots"
      :key="index"
      #[tab]
    >
      <slot :name="tab" />
    </template>
  </KTabs>
</template>

<script lang="ts" setup>
import { KTabs } from '@kong/kongponents'
import { computed, PropType, ref } from 'vue'

import { logEvents } from '@/services/logger/Logger'
import { useLogger } from '@/utilities'
import { QueryParameter } from '@/utilities/QueryParameter'

const logger = useLogger()

const props = defineProps({
  tabs: {
    type: Array as PropType<Array<{ hash: string, title: string }>>,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'on-tab-change', tabHash: string): void,
}>()

const activeTabHash = ref('')

const tabsSlots = computed(() => props.tabs.map((tab) => tab.hash.replace('#', '')))

function start() {
  const tab = QueryParameter.get('tab')

  if (tab !== null) {
    activeTabHash.value = `#${tab}`
  }
}

start()

function switchTab(newActiveTabHash: string): void {
  QueryParameter.set('tab', newActiveTabHash.substring(1))

  logger.info(logEvents.TABS_TAB_CHANGE, { data: { newActiveTabHash } })

  emit('on-tab-change', newActiveTabHash)
}
</script>

<style lang="scss">
.tab-container {
  margin-top: var(--AppGap);
}
</style>
