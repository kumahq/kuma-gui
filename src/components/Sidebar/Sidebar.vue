<template>
  <KNav :is-collapsed="isCollapsed">
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
      <div class="sidebar-message-wrap">
        <!-- <div
          v-if="kumaInfo"
          class="sidebar-app-info"
        >
          {{ kumaInfo }}
        </div> -->
        <div class="sidebar-message">
          <h4 class="mb-4 md sidebar-message__title">
            Resources
          </h4>
          <ul>
            <li
              v-for="(item, index) in resourceLinks"
              :key="index"
            >
              <a
                :href="item.link"
                target="_blank"
              >
                {{ item.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <CollapseToggle
        :handle-toggle-collapse="handleToggleCollapse"
      />
    </div>
  </KNav>
</template>

<script>
import KNav from '@/components/Sidebar/KNav'
import SidebarMenu from '@/components/Sidebar/SidebarMenu'
import CollapseToggle from '@/components/Sidebar/CollapseToggle'
import MeshSelector from '@/components/Utils/MeshSelector'

import { getItemFromStorage, setItemToStorage } from '@/Cache'
import { mapState, mapMutations } from 'vuex'

export default {
  components: {
    KNav,
    SidebarMenu,
    CollapseToggle,
    MeshSelector
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

    // ...mapState('workspaces', {
    //   workspace: state => state.workspace,
    //   workspaces: state => state.workspaces
    // }),

    resourceLinks () {
      const storedVersion = this.$store.getters.getVersion
      const ver = (storedVersion !== null) ? storedVersion : 'latest'

      return [
        {
          link: `https://kuma.io/docs/${ver}/`,
          label: 'Kuma Documentation'
        },
        {
          link: 'https://kuma-mesh.slack.com/',
          label: 'Kuma Community Chat'
        },
        {
          link: 'https://github.com/Kong/kuma',
          label: 'Kuma GitHub Repository'
        }
      ]
    },

    ...mapState('sidebar', {
      menu: state => state.menu
    }),

    // workspaceList () {
    //   return this.workspaces
    // },

    // currentWorkspace () {
    //   return this.workspaceList.filter(w => w.name === this.workspace)[0]
    // },

    // portalIsLegacy () {
    //   return this.$store.getters['workspaces/getWorkspaceConfigValue']('portal_is_legacy')
    // },

    // portalIsEnabled () {
    //   return this.$store.getters['workspaces/getWorkspaceConfigValue']('portal')
    // },

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
    },

    meshList () {
      return this.$store.state.meshes
    }

    // kumaInfo () {
    //   const tagline = this.$store.getters.getTagline
    //   const version = this.$store.getters.getVersion

    //   if (tagline && version) {
    //     return `${tagline} v${version}`
    //   } else {
    //     return false
    //   }
    // }
  },

  mounted () {
    const sidebarState = getItemFromStorage('sidebarCollapsed')

    if (document.documentElement.clientWidth <= 900) {
      this.isCollapsed = true
    } else {
      this.isCollapsed = sidebarState || false
    }

    window.addEventListener('resize', this.handleResize)

    // this.getKumaInfo()
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

    getKumaInfo () {
      this.$store.dispatch('getVersion')
      this.$store.dispatch('getTagline')
    }

    // openWorkspaces () {
    //   this.toggleWorkspaces = !this.toggleWorkspaces
    // },
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
.workspace-toggle > span{
  top: 10px
}

.sidebar-message-wrap {
  position: fixed;
  bottom: 36px;
  width: 240px;

  nav.closed & {
    display: none;
  }
}

.sidebar-app-info {
  padding: 32px;
  font-size: 14px;
  line-height: 25px;
  color: var(--tblack-45);
}

.sidebar-message {
  background-color: #FFF5E0;
  box-shadow: inset 0 1px 0 0 rgba(0,0,0,0.10);
  padding: 32px;
  font-size: 14px;
  line-height: 25px;
  color: rgba(0, 0, 0, .75);

  p:first-of-type {
    margin-bottom: 16px;
  }

  a {
    color: #1782CF;
  }

  ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }
}

.sidebar-message__title {
  text-transform: uppercase;
  border-bottom: 1px solid rgba(0,0,0,0.10);
  padding-bottom: 6px;
  margin-top: 0;
}

// mobile fix
@media only screen and (max-width: 900px) {
  .sidebar-toggle {
    display: block !important;
    height: auto !important;

    span {
      display: none;
    }
  }
}
</style>
