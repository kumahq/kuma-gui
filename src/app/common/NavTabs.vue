<template>
  <KTabs
    :tabs="kTabs"
    :model-value="currentTabHash"
    :show-panels="false"
    class="nav-tabs"
    data-testid="nav-tabs"
  >
    <template
      v-for="tab in props.tabs"
      :key="`${tab.routeName}-anchor`"
      #[`${tab.routeName}-anchor`]
    >
      <RouterLink
        class="nav-tab-link"
        :data-testid="`${tab.routeName}-tab`"
        :to="{ name: tab.routeName }"
      >
        {{ tab.title }}
      </RouterLink>
    </template>
  </KTabs>
</template>

<script lang="ts" setup>
import { KTabs, Tab } from '@kong/kongponents'
import { PropType, computed } from 'vue'
import { useRoute } from 'vue-router'

export interface NavTab {
  title: string
  routeName: string
  module: string
}

const route = useRoute()

const props = defineProps({
  tabs: {
    type: Array as PropType<NavTab[]>,
    required: true,
  },
})

const kTabs = computed<Tab[]>(() => props.tabs.map((tab) => ({
  title: tab.title,
  hash: '#' + tab.routeName,
})))
const currentTabHash = computed(() => {
  const modules = route.matched
    .map((route) => route.meta.module ?? '')
    .filter((module) => module !== '')
  modules.reverse()

  const activeTab = props.tabs.find((tab) => {
    if (tab.routeName === route.name) {
      return true
    }

    if (modules.includes(tab.module)) {
      return true
    }

    return false
  })
  const routeName = activeTab?.routeName ?? props.tabs[0].routeName

  return '#' + routeName
})
</script>

<style lang="scss" scoped>
.nav-tabs {
  overflow-x: auto;
  width: 100%;
}

.nav-tabs :deep(.tab-item) {
  white-space: nowrap;
  // TODO: Remove this if it’s fixed in Kongponents.
  // Avoids animating between 1px and 2px which causes layout shift.
  transition: none !important;
}

.nav-tabs :deep(.tab-link) {
  // TODO: Remove this if it’s fixed in Kongponents.
  // Resets the padding so that we can shift it onto the actual link inside the tabs making it take up the entire click target area of the tab.
  padding: 0 !important;
}

.nav-tab-link {
  padding: $kui-space-30 $kui-space-50;
}
</style>
