<template>
  <aside class="app-sidebar">
    <div class="main-nav">
      <div class="main-nav__top">
        <NavItem
          v-for="(item, key) in topMenuItems"
          :key="key"
          v-bind="item"
          has-custom-icon
          :is-secondary="false"
        >
          <template
            v-if="item.iconCustom && !item.icon"
            #item-icon
          >
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="item.iconCustom" />
          </template>
        </NavItem>
      </div>

      <div class="main-nav__bottom">
        <NavItem
          v-for="(item, key) in bottomMenuItems"
          :key="key"
          v-bind="item"
          has-icon
          :is-secondary="false"
        />
      </div>
    </div>

    <Subnav
      v-if="topMenuItems.length > 0"
      class="app-sidebar__secondary"
      :title="topMenuItems[0].name"
      :title-link="topMenuItems[0].link"
      :items="topNavItems"
    >
      <template #top>
        <MeshSelector :items="meshList" />
      </template>
    </Subnav>
  </aside>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import NavItem from '@/components/Sidebar/NavItem.vue'
import Subnav from '@/components/Sidebar/Subnav.vue'
import MeshSelector from '@/components/Utils/MeshSelector.vue'
import { getTopMenuItems, getBottomMenuItems } from '@/components/Sidebar/menu'

export default {
  name: 'AppSidebar',

  components: {
    MeshSelector,
    NavItem,
    Subnav,
  },

  data() {
    return {
      topMenuItems: [],
      bottomMenuItems: getBottomMenuItems(),
    }
  },

  computed: {
    ...mapState({
      selectedMesh: (state) => state.selectedMesh,
      policies: (state) => state.policies,
    }),

    ...mapGetters({
      featureFlags: 'config/featureFlags',
    }),

    topNavItems() {
      if (this.topMenuItems.length > 0) {
        return this.topMenuItems[0].subNav.items.filter((menuItem) => {
          if (!menuItem.featureFlags) {
            return true
          }

          return menuItem.featureFlags.every((featureFlag) => this.featureFlags.includes(featureFlag))
        })
      } else {
        return []
      }
    },

    meshList() {
      return this.$store.state.meshes
    },

    selectedMenuItem() {
      if (this.topMenuItems.length === 0) {
        return null
      }

      for (const section of [...this.topMenuItems, ...this.bottomMenuItems]) {
        for (const item of section.items) {
          if (this.$route.name !== item.link && !this.$route.meta.hideSubnav) {
            return item
          }
        }
      }

      return null
    },

    touchDevice() {
      return !!('ontouchstart' in window || navigator.maxTouchPoints)
    },
  },

  watch: {
    selectedMesh() {
      this.getMeshInsights()
    },
  },

  created() {
    this.topMenuItems = getTopMenuItems(this.policies)
  },

  methods: {
    ...mapActions({
      getMeshInsights: 'sidebar/getMeshInsights',
    }),
  },
}
</script>

<style lang="scss" scoped>
.app-sidebar {
  width: calc(var(--sidebarCollapsedWidth) + var(--subnavWidth));
  position: fixed;
  z-index: 3;
  top: var(--topbar-height);
  left: 0;
  bottom: 0;
  display: flex;
}

.app-sidebar__secondary {
  flex-grow: 1;
}

.main-nav {
  width: var(--sidebarCollapsedWidth);
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem 0 2rem;
  background-color: var(--sidebarBackground);
  transition: var(--transitionTiming) width var(--transition);
}

.main-nav:hover {
  width: var(--sidebarOpenWidth);
  cursor: pointer;
  box-shadow: 0 20px 25px -5px var(--black-10), 0 10px 10px -5px var(--black-10);
}
</style>
