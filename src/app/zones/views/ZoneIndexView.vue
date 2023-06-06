<template>
  <KTabs
    v-if="store.getters['config/getMulticlusterStatus']"
    class="nav-tabs"
    :tabs="kTabs"
    :model-value="currentTabHash"
  >
    <template
      v-for="tab in TABS"
      :key="`${tab.routeName}-anchor`"
      #[`${tab.routeName}-anchor`]
    >
      <router-link :to="{ name: tab.routeName }">
        {{ tab.title }}
      </router-link>
    </template>
  </KTabs>

  <RouterView v-slot="{ Component, route }">
    <component
      :is="Component"
      :key="route.path"
    />
  </RouterView>
</template>

<script lang="ts" setup>
import { KTabs, Tab } from '@kong/kongponents'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useStore } from '@/store/store'
import { useI18n } from '@/utilities'

const i18n = useI18n()
const currentRoute = useRoute()
const store = useStore()

const TABS = [
  {
    routeName: 'zone-cp-list-view',
    activeRouteNames: ['zone-cp-detail-view'],
  },
  {
    routeName: 'zone-ingress-list-view',
    activeRouteNames: ['zone-ingress-detail-view'],
  },
  {
    routeName: 'zone-egress-list-view',
    activeRouteNames: ['zone-egress-detail-view'],
  },
].map((tab) => ({ ...tab, title: i18n.t(`zones.navigation.${tab.routeName}`) }))

const kTabs = computed<Tab[]>(() => TABS.map((tab) => {
  const { title, routeName } = tab

  return {
    title,
    hash: '#' + routeName,
  }
}))
const currentTabHash = computed(() => {
  const activeTab = TABS.find((tab) => {
    if (tab.routeName === currentRoute.name) {
      return true
    }

    if (Array.isArray(tab.activeRouteNames) && tab.activeRouteNames.includes(currentRoute.name as string)) {
      return true
    }

    return false
  })
  const routeName = activeTab?.routeName ?? TABS[0].routeName

  return '#' + routeName
})
</script>

<style scoped>
.tab-link a {
  display: block;
  padding: var(--spacing-md);
  text-decoration: none;
  color: var(--KTabsColor)
}

.tab-item.active .tab-link a {
  color: var(--KTabsActiveColor)
}
</style>

<style lang="scss">
// Resets the padding on tab items so we can add the padding to the tab item links instead.
.nav-tabs > ul > .tab-item {
  padding: 0 !important;
}
</style>
