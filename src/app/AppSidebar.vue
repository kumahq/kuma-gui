<template>
  <div class="app-sidebar-wrapper">
    <aside class="app-sidebar">
      <AppNavItem
        v-for="(item, index) in navItems"
        :key="index"
        :name="item.name"
        :route-name="item.routeName"
        :anchor-route-name="item.anchorRouteName"
      />
    </aside>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import AppNavItem from './AppNavItem.vue'
import { useStore } from '@/store/store'
import { useNav } from '@/utilities'

const getNavItems = useNav()
const store = useStore()

const navItems = computed(() => getNavItems(store.state.mode === 'global'))
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
