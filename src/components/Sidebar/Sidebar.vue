<template>
  <aside
    id="the-sidebar"
    :class="[{ 'has-subnav': hasSubnav }, { 'is-collapsed': isCollapsed }]"
  >
    <!-- <MeshSelector :items="meshList" /> -->
    <div
      class="main-nav"
      :class="{ 'is-hovering': isHovering }"
      @mouseover="isHovering = true"
      @mouseout="isHovering = false"
    >
      <div class="top-nav">
        <NavItem
          v-for="(item, idx) in topNavItems"
          :key="idx"
          v-bind="item"
          has-icon
        />
      </div>
      <!-- <div class="bottom-nav"></div> -->
    </div>
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
    NavItem
  },

  data () {
    return {
      isCollapsed: false,
      sidebarSavedState: null,
      toggleWorkspaces: false,
      hovering: false
    }
  },

  computed: {
    // ...mapState('auth', {
    //   perms: state => state.permissions
    // }),

    ...mapState('sidebar', {
      menu: state => state.menu
    }),
    topNavItems () {
      return this.getNavItems(this.menu, 'top')
    },

    lastMenuList () {
      return Object.keys(this.menuList.sections).length - 1
    },

    meshList () {
      return this.$store.state.meshes
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

    getNavItems (menu, position) {
      return menu.find(i => i.position === position).items
    },

    handleToggleCollapse () {
      this.isCollapsed = !this.isCollapsed
      this.setCollapsedState(this.isCollapsed)
    },

    isHovering (a) {
      this.hovering = a
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
    &#the-sidebar + .content {
      margin-left: var(--sidebarOpenWidth);
    }
    &#the-sidebar.has-subnav + .content {
      margin-left: calc(var(--sidebarCollapsedWidth) + var(--subnavWidth));
    }
  }
}
</style>
