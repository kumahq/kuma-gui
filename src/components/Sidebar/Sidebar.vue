<template>
  <aside
    id="the-sidebar"
    :class="[
      { 'has-subnav': hasSubnav },
      { 'is-collapsed': isCollapsed },
      { 'subnav-expanded': subnavIsExpanded }
    ]"
  >
    <div
      ref="sidebarControl"
      class="main-nav"
      :class="{ 'is-hovering': isHovering || subnavIsExpanded === false }"
    >
      <div class="top-nav">
        <NavItem
          v-for="(item, idx) in titleNavItems"
          :key="idx"
          v-bind="item"
          has-icon
          @click.native="toggleSubnav()"
        />
      </div>
      <div class="bottom-nav">
        <NavItem
          v-for="(item, idx) in bottomNavItems"
          :key="idx"
          v-bind="item"
          has-icon
        />
      </div>
    </div>
    <Subnav
      v-if="hasSubnav && subnavIsExpanded"
      :title="selectedMenuItem.name"
      :title-link="selectedMenuItem.link"
      :items="topNavItems"
    >
      <template slot="top">
        <MeshSelector :items="meshList" />
      </template>
    </Subnav>
  </aside>
</template>

<script>
import NavItem from '@/components/Sidebar/NavItem'
import Subnav from '@/components/Sidebar/Subnav'
import MeshSelector from '@/components/Utils/MeshSelector'

import { getItemFromStorage, setItemToStorage } from '@/Cache'
import { mapState, mapMutations } from 'vuex'

export default {
  components: {
    MeshSelector,
    NavItem,
    Subnav
  },

  data () {
    return {
      isCollapsed: false,
      sidebarSavedState: null,
      toggleWorkspaces: false,
      isHovering: false,
      subnavIsExpanded: false
    }
  },

  computed: {
    // ...mapState('auth', {
    //   perms: state => state.permissions
    // }),

    ...mapState('sidebar', {
      menu: state => state.menu
    }),

    titleNavItems () {
      return this.menu.find(i => i.position === 'top').items
    },

    topNavItems () {
      return this.menu.find(i => i.position === 'top').items[0].subNav.items
    },

    bottomNavItems () {
      return this.menu.find(i => i.position === 'bottom').items
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

          // const conditions = matchesUrlPath &&
          //   isNotRootLevelMenuItem &&
          //   item.subNav &&
          //   !route.meta.hideSubnav

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
      // this.isHovering = false
      // this.subnavIsExpanded = false
    }
  },

  mounted () {
    // const sidebarState = getItemFromStorage('sidebarCollapsed')

    const app = this.$appWindow

    if (app.innerWidth <= 900) {
      this.isCollapsed = true
    } else {
      this.isCollapsed = false
    }

    window.addEventListener('resize', this.handleResize)

    this.sidebarEvent()
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
      // const sidebarState = getItemFromStorage('sidebarCollapsed')
      const appWidth = this.$appWindow.innerWidth

      if (appWidth <= 900) {
        this.isCollapsed = true
        this.subnavIsExpanded = false
        this.isHovering = false
      }

      if (appWidth >= 900) {
        this.isCollapsed = false
        this.isHovering = true
      }
    },

    toggleSubnav () {
      this.subnavIsExpanded = !this.subnavIsExpanded
      this.isCollapsed = true
    },

    sidebarEvent () {
      // determine if the user is on a touch or non-touch device
      // and then use the proper events accordingly.
      const eventResult = () => {
        const hasTouch = !!('ontouchstart' in window || navigator.maxTouchPoints)
        const el = this.$refs.sidebarControl

        if (hasTouch) {
          el.addEventListener('touchstart', () => {
            this.isHovering = true
          })

          el.addEventListener('touchend', () => {
            this.isHovering = false
          })
        } else {
          el.addEventListener('mouseover', () => {
            this.isHovering = true
          })

          el.addEventListener('mouseout', () => {
            this.isHovering = false
          })
        }

        if (process.env.NODE_ENV === 'development') {
          console.info(`Touch: ${hasTouch}`)
        }
      }

      return eventResult()
    }
  }
}
</script>

<style lang="scss">
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

    .top-nav {
      margin-bottom: auto;
    }
  }

  // Move content over
  @media only screen and (max-width: 1650px) {
    & + .main-content {
      margin-left: var(--sidebarOpenWidth);
    }

    // &.has-subnav + .main-content {
    &.subnav-expanded + .main-content {
      margin-left: calc(var(--sidebarCollapsedWidth) + var(--subnavWidth));
    }
  }
}
</style>
