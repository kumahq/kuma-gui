<template>
  <div
    :class="{ 'is-collapsed': isCollapsed }"
    class="secondary-nav"
  >
    <div class="mt-3">
      <slot name="top" />
    </div>
    <!-- <div
      class="arrow"
      @click="handleToggle"
    /> -->
    <div class="subnav-title">
      <span class="text-uppercase">
        <slot name="title">
          <router-link :to="{ name: titleLink }">
            {{ title }}
          </router-link>
        </slot>
      </span>
    </div>
    <slot name="bottom" />
    <NavItem
      v-for="(item, idx) in items"
      :key="idx"
      v-bind="item"
      @click.native="handleToggle"
    />
  </div>
</template>

<script>
import NavItem from '@/components/Sidebar/NavItem'

export default {
  name: 'SubNav',
  components: {
    NavItem
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      required: true
    },
    titleLink: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isCollapsed: false
    }
  },
  computed: {
    touchDevice () {
      return !!('ontouchstart' in window || navigator.maxTouchPoints)
    }
  },
  methods: {
    handleToggle () {
      if (this.touchDevice) {
        this.isCollapsed = !this.isCollapsed
        this.$emit('toggled', this.isCollapsed)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.secondary-nav {
  position: fixed;
  left: var(--sidebarCollapsedWidth);
  width: var(--subnavWidth);
  height: 100%;
  border-left: 1px solid var(--steal-300);
  background-color: var(--white);
  transition: width 200ms ease-out;

  &.is-collapsed {
    width: 0;
  }

  .subnav-title {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 1rem;
    font-weight: 500;
    font-size: var(--type-sm);

    a {
      color: var(--SidebarTitleColor);
      text-decoration: none;

      // &:hover {
      //   color: var(--blue-700);
      // }
    }
  }
}
</style>

<style lang="scss">
.secondary-nav {
  overflow-x: auto;
  touch-action: pan-y;

  .nav-item {
    height: auto;
    padding: 0;
    margin: 0 var(--subnavHorizontalMargin) var(--spacing-xxs);
    border-radius: 5px;

    a {
      padding: 10px;
    }

    &.is-active {
      font-weight: 500;
      background-color: var(--SidebarLinkBGColor);

      &:before {
        display: none;
      }
    }

    &:hover {
      background: var(--SidebarLinkBGColor);
    }
  }
}
</style>
