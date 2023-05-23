<template>
  <div class="app-sidebar-wrapper">
    <aside class="app-sidebar">
      <AppNavItem
        v-for="(item, index) in navItems"
        :key="index"
        :name="item.name"
        :route-name="item.routeName"
        :anchor-route-name="item.anchorRouteName"
        :insights-field-accessor="item.insightsFieldAccessor"
      />
    </aside>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

import AppNavItem from './AppNavItem.vue'
import { useStore } from '@/store/store'
import { useNav } from '@/utilities'
import { poll } from '@/utilities/poll'

const POLLING_INTERVAL_IN_SECONDS = 10

const getNavItems = useNav()
const route = useRoute()
const store = useStore()

const navItems = computed(() => getNavItems(store.getters['config/getMulticlusterStatus']))

watch(() => route.params.mesh, (newMesh, oldMesh) => {
  if (newMesh !== oldMesh && newMesh) {
    store.dispatch('sidebar/getMeshInsights', newMesh)
  }
})

let shouldStopPolling = false

onMounted(function () {
  window.addEventListener('blur', setShouldStopPolling)
  window.addEventListener('focus', startPolling)
})

onUnmounted(function () {
  window.removeEventListener('blur', setShouldStopPolling)
  window.removeEventListener('focus', startPolling)
})

startPolling()

function setShouldStopPolling() {
  shouldStopPolling = true
}

function startPolling() {
  shouldStopPolling = false
  poll(fetchInsights, POLLING_INTERVAL_IN_SECONDS * 1000, () => shouldStopPolling)
}

function fetchInsights() {
  return store.dispatch('sidebar/getInsights')
}
</script>

<style lang="scss" scoped>
// This wrapping element is necessary. It ensures that the sidebar can participate in a grid or flex container.
.app-sidebar-wrapper {
  position: static;
}

.app-sidebar {
  width: var(--AppSidebarWidth);
  position: fixed;
  z-index: 10;
  top: var(--AppHeaderHeight);
  bottom: 0;
  left: 0;
  overflow-y: auto;
  padding-top: var(--spacing-xs);
  padding-right: var(--spacing-xs);
  border-right: var(--KCardBorder);
  background-color: var(--white);
}
</style>
