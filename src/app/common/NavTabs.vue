<template>
  <KTabs
    :tabs="kTabs"
    :model-value="currentTabHash"
    :has-panels="false"
  >
    <template
      v-for="tab in props.tabs"
      :key="`${tab.routeName}-anchor`"
      #[`${tab.routeName}-anchor`]
    >
      <router-link :to="{ name: tab.routeName }">
        {{ tab.title }}
      </router-link>
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
