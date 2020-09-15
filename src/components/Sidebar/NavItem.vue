<template>
  <div
    :class="[
      { 'is-active': isActive },
      { 'is-menu-item': isMenuItem },
      { 'is-disabled': isDisabled }
    ]"
    class="nav-item"
  >
    <router-link :to="routerLink">
      <div
        v-if="hasIcon"
        class="nav-icon"
      >
        <slot name="item-icon">
          <KIcon
            width="18"
            height="18"
            view-box="0 0 18 18"
            :color="iconColor"
            :icon="icon"
          />
        </slot>
      </div>
      <div class="nav-link">
        <slot name="item-link">
          {{ name }}
        </slot>
      </div>
      <slot />
    </router-link>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'NavItem',
  props: {
    link: {
      type: String,
      default: '',
      required: false
    },
    linkObj: {
      type: Object,
      default: () => null,
      required: false
    },
    name: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    hasIcon: {
      type: Boolean,
      default: false
    },
    isMenuItem: {
      type: Boolean,
      default: true
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      meshPath: null
    }
  },
  computed: {
    ...mapState(['selectedMesh']),
    ...mapGetters({
      multicluster: 'getMulticlusterStatus'
    }),
    linkPath () {
      const link = this.link

      if (this.link.pathFlip) {
        return link.root
          ? this.preparePath(link.url)
          : `${this.preparePath(link.url)}/${this.meshPath}`
      }

      return link.root
        ? this.preparePath(link.url)
        : `/${this.meshPath}${this.preparePath(link.url)}`
    },
    routerLink () {
      const params = !this.subNav && Object.keys(this.$route?.params || {}).length > 0
        ? this.$route?.params
        : undefined

      return this.linkObj || { name: this.link, params }
    },
    isActive () {
      const navItemRouteName = this.link
      const currentRoute = this.$route
      const currentRouteSubpath = this.$route.path.split('/')[2]

      if (navItemRouteName === currentRoute.name) { return true }

      if (currentRouteSubpath === this.routerLink.name) { return true }

      return navItemRouteName && currentRoute.matched.some(r => {
        return navItemRouteName === r.name || navItemRouteName === r.redirect
      })
    },
    iconColor () {
      return 'var(--blue-500)'
      // return this.isActive
      //   ? 'var(--blue-500)'
      //   : 'var(--steal-400)'
    }
  },
  watch: {
    selectedMesh () {
      // set the menu links accordingly when the selected mesh changes
      this.setMeshPath()
    }
  },
  beforeMount () {
    this.setMeshPath()
  },
  methods: {
    preparePath (path) {
      return path[0] === '/' ? path : `/${path}`
    },

    setMeshPath () {
      const meshFromLocalStorage = localStorage.getItem('selectedMesh')
      const meshFromRoute = this.$route.params.mesh

      if (meshFromRoute && meshFromRoute.length > 0) {
        // if the route has a mesh param set, use that for the path
        this.meshPath = meshFromRoute
      } else if (meshFromLocalStorage && meshFromLocalStorage.length > 0) {
        // otherwise fall back to what's present in localStorage
        this.meshPath = meshFromLocalStorage
      }

      // otherwise fallback to what's in the store (it has a default value)
      this.meshPath = this.$store.getters.getSelectedMesh
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-item {
  position: relative;
  display: flex;
  margin-bottom: 12px;
  white-space: nowrap;
  overflow: hidden;
  a {
    display: flex;
    width: 100%;
    align-items: center;
    color: var(--blue-700);
    text-decoration: none;
    padding: 8px 20px;
  }
  .nav-icon {
    display: flex;
    padding-right: 20px;
  }
  &.is-disabled {
    opacity: .5;
    pointer-events: none;
  }
}
</style>

<style lang="scss">
// Only add left border to main nav item
.main-nav .nav-item {
  position: relative;

  &:hover:not(.is-active) {
    color: var(--blue-500);

    svg path {
      fill: var(--blue-500);
    }
  }
  &.is-active:before {
    position: absolute;
    display: block;
    top: 0;
    bottom: 0;
    width: 3px;
    background-color: var(--blue-500);
    content: '';
  }
}
</style>
