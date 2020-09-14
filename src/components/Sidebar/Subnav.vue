<template>
  <div
    :class="{ 'is-collapsed': isCollapsed }"
    class="secondary-nav"
  >
    <div
      class="arrow"
      @click="handleToggle"
    />
    <div class="subnav-title">
      <span class="text-uppercase">
        <slot name="title">
          <router-link :to="{ name: titleLink }">
            {{ title }}
          </router-link>
        </slot>
      </span>
    </div>
    <slot />
    <NavItem
      v-for="(item, idx) in items"
      :key="idx"
      v-bind="item"
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
  methods: {
    handleToggle () {
      this.isCollapsed = !this.isCollapsed
      this.$emit('toggled', this.isCollapsed)
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
  .subnav-title {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 1rem;
    font-weight: 500;
    font-size: var(--type-sm);
    a {
      color: var(--steal-400);
      text-decoration: none;
      &:hover {
        color: var(--blue-700);
      }
    }
  }
}
</style>

<style lang="scss">
.secondary-nav .nav-item {
  height: auto;
  padding: 0;
  margin: 0 var(--subnavHorizontalMargin) var(--spacing-xxs);
  border-radius: 5px;
  a { padding: 10px; }
  &.is-active {
    font-weight: 500;
    background-color: var(--blue-100);
    &:before { display: none; }
  }
  &:hover { background: var(--blue-100); }
}
</style>
