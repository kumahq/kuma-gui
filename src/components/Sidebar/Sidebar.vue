<template>
  <KNav :is-collapsed="isCollapsed">
    <div
      slot="NavMenu"
      :class="{'is-hovering': hovering}"
      class="menu-container"
    >
      <SidebarMenu
        v-for="(menu, i) in menuList.sections"
        :key="i"
        :menu="menu"
        :trigger-hovering="isHovering"
        :index="i"
        :is-last="i === lastMenuList"
      />
      <CollapseToggle
        :handle-toggle-collapse="handleToggleCollapse"
      />
    </div>
  </KNav>
</template>

<script>
import KNav from './KNav'
import SidebarMenu from './SidebarMenu'
import CollapseToggle from './CollapseToggle'

import { getItemFromStorage, setItemToStorage } from '@/Cache'
import { mapState, mapMutations } from 'vuex'

export default {
  components: {
    KNav,
    SidebarMenu,
    CollapseToggle
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
    ...mapState('auth', {
      perms: state => state.permissions
    }),

    ...mapState('workspaces', {
      workspace: state => state.workspace,
      workspaces: state => state.workspaces
    }),

    ...mapState('sidebar', {
      menu: state => state.menu
    }),

    workspaceList () {
      return this.workspaces
    },

    currentWorkspace () {
      return this.workspaceList.filter(w => w.name === this.workspace)[0]
    },

    portalIsLegacy () {
      return this.$store.getters['workspaces/getWorkspaceConfigValue']('portal_is_legacy')
    },

    portalIsEnabled () {
      return this.$store.getters['workspaces/getWorkspaceConfigValue']('portal')
    },

    /**
     * Main property for items in the sidebar menu. Filters out menu.js items by
     * RBAC permissions and fetches Kong Admin Plugin routes
     * @returns {{sections:Array<MenuItem>}}
     */
    menuList () {
      // get routes allowed by rbac
      // const routes = this.$rbac.filterRoutes(this.perms, this.$router.allRoutes,
      //   this.currentWorkspace && this.currentWorkspace.name)

      // const routes = this.$router.allRoutes

      const filteredMenu = JSON.parse(JSON.stringify(this.menu))

      return filteredMenu
    },

    lastMenuList () {
      return Object.keys(this.menuList.sections).length - 1
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
    },

    openWorkspaces () {
      this.toggleWorkspaces = !this.toggleWorkspaces
    }
  }
}
</script>

<style lang='scss'>
$top-nav-height: 75px;
.workspace-tile {
  padding: 24px 0;
  border-bottom: 1px solid #e0e1e2;
  margin: 0 1rem;

  a:hover, a:focus {
    text-decoration: none;
  }
}
.gry-bounding {
  display: flex;
  position: relative;
  align-items: center;
  padding: 20px;
  height: 36px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  border-bottom: 1px solid #e0e1e2;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: background-color 0.2s ease;
  span {
    position: absolute;
    left: 60px;
    white-space: nowrap;
  }
  .workspace-toggle {
    border-bottom: 1px solid;
  }
  &:hover {
    background: darken(#f5f6f7, 2%);
  }

  nav.closed & {
    box-shadow: none;
    background: none;
    span {
      display: none;
    }
  }
}

nav {
  .menu-container {
    width: 240px;
    height: calc(100vh - 145px); // 100vh - (Header + ws picker + collapse btn)
    overflow-y: auto;
    overflow-x: hidden;
  }
  &.closed {
    .workspace-tile {
      border-top: 1px solid #e0e1e2;
    }
    .gry-bounding {
      height: auto;
      border: none;
      padding: 20px;
    }
    .menu-container {
      width: 63px;
      overflow: hidden;
    }
  }
}

.workspace-toggle,
.sidebar-toggle {
  @extend .gry-bounding;
}

/* Fix for IE */
.workspace-toggle>span{
  top: 10px
}
</style>
