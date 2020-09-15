<template>
  <aside
    id="the-sidebar"
    :class="[
      { 'has-subnav': hasSubnav },
      { 'is-collapsed': isCollapsed }
    ]"
  >
    <div
      class="main-nav"
      :class="{ 'is-hovering': isHovering }"
      @mouseover="isHovering = true"
      @mouseout="isHovering = false"
    >
      <div class="top-nav">
        <!-- <MeshSelector :items="meshList" /> -->
        <NavItem
          v-for="(item, idx) in titleNavItem"
          :key="idx"
          v-bind="item"
          has-icon
        />
      </div>
      <!-- <div class="bottom-nav"></div> -->
    </div>
    <Subnav
      :title="selectedMenuItem.name"
      :title-link="selectedMenuItem.link"
      :items="topNavItems"
      @toggled="(state) => isCollapsed = state"
    />
  </aside>

  <!-- <KNav :is-collapsed="isCollapsed">
    <div
      slot="NavMenu"
      :class="{ 'is-hovering': hovering }"
      class="menu-container"
    >
      <MeshSelector :items="meshList" />
      <SidebarMenu
        v-for="(menu, i) in menuList.sections"
        :key="i"
        :menu="menu"
        :trigger-hovering="isHovering"
        :index="i"
        :is-last="i === lastMenuList"
      />
    </div>
  </KNav> -->
</template>

<script>
import KNav from '@/components/Sidebar/KNav'
import SidebarMenu from '@/components/Sidebar/SidebarMenu'
import NavItem from '@/components/Sidebar/NavItem'
import Subnav from '@/components/Sidebar/Subnav'
// import CollapseToggle from '@/components/Sidebar/CollapseToggle'
// import MeshSelector from '@/components/Utils/MeshSelector'

import { getItemFromStorage, setItemToStorage } from '@/Cache'
import { mapState, mapMutations } from 'vuex'

export default {
  components: {
    // KNav,
    // SidebarMenu,
    // CollapseToggle,
    // MeshSelector,
    NavItem,
    Subnav
  },

  data () {
    return {
      isCollapsed: false,
      sidebarSavedState: null,
      toggleWorkspaces: false,
      isHovering: false
    }
  },

  computed: {
    // ...mapState('auth', {
    //   perms: state => state.permissions
    // }),

    ...mapState('sidebar', {
      menu: state => state.menu
    }),

    titleNavItem () {
      return this.menu.find(i => i.position === 'top').items
    },

    topNavItems () {
      return this.menu.find(i => i.position === 'top').items[0].subNav.items
    },

    bottomNavItems () {
      return this.menu.find(i => i.position === 'bottom').items[0].subNav.items
    },

    hasSubnav () {
      return Boolean(this.selectedMenuItem?.subNav?.items?.length)
    },

    lastMenuList () {
      return Object.keys(this.menuList.sections).length - 1
    },

    meshList () {
      return this.$store.state.meshes
    },

    selectedMenuItem () {
      const route = this.$route

      for (const section of this.menu) {
        for (const item of section.items) {
          const urlPath = route.path.split('/')[2]
          const isNotRootLevelMenuItem = route.name !== item.link
          const matchesUrlPath = urlPath === item.link

          // const conditions = matchesUrlPath
          //   && isNotRootLevelMenuItem
          //   && item.subNav
          //   && !route.meta.hideSubnav

          const conditions = isNotRootLevelMenuItem && !route.meta.hideSubnav

          if (conditions) {
            return item
          }
        }
      }

      return null
    }
  },

  watch: {
    '$route' () {
      this.isHovering = false
    }
  },

  mounted () {
    const sidebarState = getItemFromStorage('sidebarCollapsed')

    if (document.documentElement.clientWidth <= 900) {
      this.isCollapsed = true
    } else {
      this.isCollapsed = sidebarState || false
    }

    window.addEventListener('resize', this.handleResize)
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
  },

  methods: {
    ...mapMutations('sidebar', [
      'setMenu'
    ]),

    getNavItems (menu, position, items) {
      return menu.find(i => i.position === position).items
    },

    handleToggleCollapse () {
      this.isCollapsed = !this.isCollapsed
      this.setCollapsedState(this.isCollapsed)
    },

    setCollapsedState (collapsedState) {
      setItemToStorage('sidebarCollapsed', collapsedState)
    },

    handleResize () {
      const sidebarState = getItemFromStorage('sidebarCollapsed')

      if (document.documentElement.clientWidth <= 900) {
        this.isCollapsed = sidebarState || true
      }

      if (document.documentElement.clientWidth >= 900) {
        this.isCollapsed = sidebarState || false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#the-sidebar {
  position: fixed;
  display: flex;
  top: var(--headerHeight);
  left: 0;
  height:  calc(100vh - 3rem);
  color: var(--blue-700);
  &.has-subnav {
    width: calc(var(--sidebarCollapsedWidth) + var(--subnavWidth));
    .main-nav {
      width: var(--sidebarCollapsedWidth);
      z-index: 1100;
      &.is-hovering {
        max-width: max-content;
        width: calc(var(--subnavWidth) + 1rem);
        cursor: pointer;
        box-shadow: 0 20px 25px -5px var(--black-10), 0 10px 10px -5px var(--black-10);
      }
    }
  }

  .main-nav {
    position: relative;
    display: flex;
    flex-direction: column;
    width: var(--sidebarOpenWidth);
    padding-bottom: 2rem;
    background-color: var(--sidebarBackground);
    transition: .2s width var(--transition);
    .top-nav { margin-bottom: auto; }
  }

  // Move content over
  @media only screen and (max-width: 1650px) {
    &#the-sidebar + .main-content {
      margin-left: var(--sidebarOpenWidth);
    }
    &#the-sidebar.has-subnav + .main-content {
      margin-left: calc(var(--sidebarCollapsedWidth) + var(--subnavWidth));
    }
  }
}
</style>
