<template>
  <KTabs
    :tabs="kTabs"
    :model-value="currentTabHash"
    hide-panels
    class="nav-tabs"
    data-testid="nav-tabs"
  >
    <template
      v-for="tab in tabs"
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
import { computed } from 'vue'
import { useRoute, useRouter, type RouteRecordRaw } from 'vue-router'

import { useI18n } from '@/utilities'
import type { Tab } from '@kong/kongponents'

interface NavTab {
  title: string
  routeName: string
  module: string
}

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const props = withDefaults(defineProps<{
  anchorRouteName: string
  i18nPrefix: string
  filterPredicate?: (route: RouteRecordRaw) => boolean
}>(), {
  filterPredicate: () => true,
})

const tabs = computed<NavTab[]>(() => {
  const routes = router.getRoutes().find((route) => route.name === props.anchorRouteName)?.children ?? []

  return routes
    .filter(props.filterPredicate)
    .map((route) => {
      const referenceRoute = typeof route.name === 'undefined' ? route.children?.[0] as RouteRecordRaw : route
      const routeName = referenceRoute.name as string
      const module = referenceRoute.meta?.module ?? ''
      const title = t(`${props.i18nPrefix}.${routeName}`)

      return { title, routeName, module }
    })
})

const kTabs = computed<Tab[]>(() => {
  return tabs.value.map((tab) => ({
    title: tab.title,
    hash: '#' + tab.routeName,
  }))
})

const currentTabHash = computed(() => {
  const modules = route.matched
    .map((route) => route.meta.module ?? '')
    .filter((module) => module !== '')
  modules.reverse()

  const activeTab = tabs.value.find((tab) => {
    if (tab.routeName === route.name) {
      return true
    }

    if (modules.includes(tab.module)) {
      return true
    }

    return false
  })
  const routeName = activeTab?.routeName ?? tabs.value[0].routeName

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
}
</style>
