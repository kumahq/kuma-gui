<template>
  <KTabs
    :tabs="kTabs"
    :model-value="currentTabHash"
    :has-panels="false"
    class="nav-tabs"
    data-testid="nav-tabs"
  >
    <template
      v-for="tab in props.tabs"
      :key="`${tab.routeName}-anchor`"
      #[`${tab.routeName}-anchor`]
    >
      <RouterLink
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
  margin-bottom: var(--AppGap);
}

.nav-tabs :deep(ul) {
  // TODO: Remove this override once KTabs was updated in Kongponents v9’s alpha version.
  // Overrides the bottom border color to the same value KCard uses for its borders.
  border-bottom-color: rgba(0, 0, 0, 0.1);
}
</style>

<style lang="scss">
.nav-tabs {
  overflow-x: auto;
  width: 100%;
}

.nav-tabs .tab-item {
  white-space: nowrap;
}

// TODO: Remove this once https://github.com/Kong/kongponents/pull/1774 is available.
// Prevents KTabs from trigger a vertical overflow of its container.
.nav-tabs .tab-item::after {
  content: none !important;
}
</style>
