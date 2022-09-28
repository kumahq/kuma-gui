<template>
  <div class="app-sidebar-wrapper">
    <aside class="app-sidebar">
      <div class="mt-3">
        <MeshSelector :items="meshList" />
      </div>

      <NavItem
        v-for="(item, index) in navItems"
        :key="index"
        v-bind="item"
      />
    </aside>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'

import { useStore } from '@/store/store'
import MeshSelector from '@/components/Utils/MeshSelector.vue'
import NavItem from '@/components/Sidebar/NavItem.vue'
import { getNavItems } from '@/components/Sidebar/menu'

const store = useStore()

const navItems = computed(() => getNavItems(store.state.policies))
const meshList = computed(() => store.state.meshes)

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
  padding-right: var(--spacing-xs);
  border-right: 1px solid var(--black-10);
  background-color: var(--white);
}
</style>
