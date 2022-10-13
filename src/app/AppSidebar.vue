<template>
  <div class="app-sidebar-wrapper">
    <aside class="app-sidebar">
      <template
        v-for="(item, index) in navItems"
        :key="index"
      >
        <template v-if="item.isMeshSelector">
          <AppMeshSelector
            v-if="meshes.length > 0"
            :meshes="meshes"
          />
        </template>

        <AppNavItem
          v-else
          v-bind="item"
        />
      </template>
    </aside>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'

import { useStore } from '@/store/store'
import AppMeshSelector from './AppMeshSelector.vue'
import AppNavItem from './AppNavItem.vue'
import { getNavItems } from './getNavItems'

const store = useStore()

const navItems = computed(() => getNavItems(store.state.policies, store.getters['config/getMulticlusterStatus']))
const meshes = computed(() => store.state.meshes.items)

watch(() => store.state.selectedMesh, () => {
  store.dispatch('sidebar/getMeshInsights')
})
</script>

<style lang="scss" scoped>
// This wrapping element is necessary. It ensures that the sidebar can participate in a grid or flex container.
.app-sidebar-wrapper {
  position: static;
}

.app-sidebar {
  width: var(--subnavWidth);
  position: fixed;
  z-index: 1;
  top: var(--topbar-height);
  bottom: 0;
  left: 0;
  overflow-y: auto;
  padding-top: var(--spacing-xs);
  padding-right: var(--spacing-xs);
  border-right: 1px solid var(--black-10);
  background-color: var(--white);
}
</style>
