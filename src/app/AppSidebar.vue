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

const navItems = computed(() => getNavItems(store.getters['config/getMulticlusterStatus']))
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
  padding-top: $kui-space-40;
  padding-right: $kui-space-40;
  border-right: $kui-border-width-10 solid $kui-color-border;
  background-color:  $kui-color-background;
}
</style>
