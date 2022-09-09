<template>
  <aside
    id="the-sidebar"
    class="has-subnav"
    :class="[
      { 'is-collapsed': isCollapsed },
      { 'subnav-expanded': subnavIsExpanded },
    ]"
  >
    <div
      ref="sidebarControl"
      class="main-nav"
      :class="{ 'is-hovering': isHovering || subnavIsExpanded === false }"
    >
      <div class="top-nav">
        <NavItem
          v-for="(item, idx) in topMenuItems"
          :key="idx"
          v-bind="item"
          has-custom-icon
          @click="toggleSubnav"
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
      <div class="bottom-nav">
        <NavItem
          v-for="(item, idx) in bottomMenuItems"
          :key="idx"
          v-bind="item"
          has-icon
        />
      </div>
    </div>
    <Subnav
      v-if="subnavIsExpanded && topMenuItems.length > 0"
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

import { APP_WINDOW } from '@/consts'

export default {
  name: 'AppSidebar',
  components: {
    MeshSelector,
    NavItem,
    Subnav,
  },

  data() {
    return {
      isCollapsed: false,
      sidebarSavedState: null,
      toggleWorkspaces: false,
      isHovering: false,
      subnavIsExpanded: true,
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

    hasSubnav() {
      return Boolean(this.selectedMenuItem?.subNav?.items?.length)
    },

    lastMenuList() {
      return Object.keys(this.menuList.sections).length - 1
    },

    meshList() {
      return this.$store.state.meshes
    },

    selectedMenuItem() {
      if (this.topMenuItems.length === 0) {
        return null
      }

      const route = this.$route

      for (const section of [...this.topMenuItems, ...this.bottomMenuItems]) {
        for (const item of section.items) {
          const isNotRootLevelMenuItem = route.name !== item.link
          // const urlPath = route.path.split('/')[2]
          // const matchesUrlPath = urlPath === item.link

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
    },

    touchDevice() {
      return !!('ontouchstart' in window || navigator.maxTouchPoints)
    },
  },

  watch: {
    selectedMesh(vaue) {
      this.getMeshInsights()
    },
  },

  created() {
    this.topMenuItems = getTopMenuItems(this.policies)
  },

  mounted() {
    this.sidebarEvent()
  },

  beforeUnmount() {
    // window.removeEventListener('resize', this.handleResize)
  },

  methods: {
    ...mapActions({
      getMeshInsights: 'sidebar/getMeshInsights',
    }),

    handleResize() {
      const appWidth = APP_WINDOW.innerWidth

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

    toggleSubnav() {
      /**
       * we want to make sure that when the user clicks one of the
       * parent items, the subnav is expanded and kept that way.
       * this reduces the amount of clicks for the user and keeps the
       * subnav items accessible.
       */
      // this.subnavIsExpanded = !this.subnavIsExpanded
      this.subnavIsExpanded = true
      this.isCollapsed = true

      localStorage.setItem('sidebarCollapsed', this.subnavIsExpanded)
    },

    sidebarEvent() {
      // determine if the user is on a touch or non-touch device
      // and then use the proper events accordingly.
      const hasTouch = this.touchDevice
      const el = this.$refs.sidebarControl

      // if the route instructs the sidebar to be expanded, handle it
      if (this.$route.params.expandSidebar && this.$route.params.expandSidebar === true) {
        this.subnavIsExpanded = true
        localStorage.setItem('sidebarCollapsed', true)
      }

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

        el.addEventListener('click', () => {
          this.isHovering = false
        })
      }
    },
  },
}
</script>

<style lang="scss">
#the-sidebar {
  position: fixed;
  z-index: 10;
  top: var(--topbar-height);
  left: 0;
  display: flex;
  height: calc(100vh - 3rem);
  color: var(--blue-700);

  .nav-icon {
    svg:not([class]) {
      display: block;
      margin: 0;
      width: 18px;
      height: 18px;

      circle {
        fill: var(--SidebarIconColor);
      }

      path {
        stroke: var(--SidebarIconColor);
      }
    }
  }

  &.has-subnav {
    width: calc(var(--sidebarCollapsedWidth) + var(--subnavWidth));

    &.subnav-expanded {
      .main-nav.is-hovering {
        box-shadow: 0 20px 25px -5px var(--black-10), 0 10px 10px -5px var(--black-10);
      }
    }

    .main-nav {
      width: var(--sidebarCollapsedWidth);
      z-index: 1100;

      &.is-hovering {
        width: var(--subnavWidth);
        cursor: pointer;
      }
    }
  }

  .main-nav {
    position: relative;
    display: flex;
    flex-direction: column;
    width: var(--sidebarOpenWidth);
    padding: 1.5rem 0 2rem;
    background-color: var(--sidebarBackground);
    transition: var(--transitionTiming) width var(--transition);

    .top-nav {
      margin-bottom: auto;
    }
  }

  & + .main-content {
    margin-left: var(--sidebarOpenWidth);
  }

  &.subnav-expanded + .main-content {
    margin-left: calc(var(--sidebarCollapsedWidth) + var(--subnavWidth));
  }

  .no-pointer-events {
    pointer-events: none;
  }
}
</style>
