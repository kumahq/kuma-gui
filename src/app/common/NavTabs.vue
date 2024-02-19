<template>
  <KTabs
    :tabs="tabs"
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
import { useRoute, type RouteLocationNormalizedLoaded } from 'vue-router'

import type { StringNamedRouteRecordRaw } from '@/app/application/components/route-view/RouteView.vue'
import { useI18n } from '@/utilities'
import type { Tab } from '@kong/kongponents'

interface NavTab extends Tab {
  routeName: string
  isActive: boolean
}

const { t } = useI18n()
const currentRoute = useRoute()

const props = withDefaults(defineProps<{
  children: StringNamedRouteRecordRaw[]
  active?: (route: RouteLocationNormalizedLoaded) => StringNamedRouteRecordRaw | undefined
  i18nPrefix: string
  filterPredicate?: (route: StringNamedRouteRecordRaw) => boolean
}>(), {
  active: () => undefined,
  filterPredicate: () => true,
})

const tabs = computed<NavTab[]>(() => {
  return props.children
    .filter(props.filterPredicate)
    .map((route) => {
      const routeName = route.name
      const hash = '#' + routeName
      const title = t(`${props.i18nPrefix}.${routeName}`)
      const isActive = props.active(currentRoute)?.name === routeName

      return { title, hash, routeName, isActive }
    })
})

const currentTabHash = computed(() => {
  const activeTab = tabs.value.find((tab) => tab.isActive) ?? tabs.value[0]

  return activeTab.hash
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
