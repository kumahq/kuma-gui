<template>
  <RouteView>
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'zone-index-view',
          },
          text: t('zones.routes.items.breadcrumbs')
        },

      ]"
    >
      <KTabs
        v-if="store.getters['config/getMulticlusterStatus']"
        :tabs="kTabs"
        :model-value="currentTabHash"
        :has-panels="false"
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
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KTabs, Tab } from '@kong/kongponents'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import { useStore } from '@/store/store'
import { useI18n } from '@/utilities'

const { t } = useI18n()
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
].map((tab) => ({ ...tab, title: t(`zones.routes.items.navigation.${tab.routeName}`) }))

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
