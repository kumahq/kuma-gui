<template>
  <div class="secondary-nav">
    <div class="mt-3">
      <slot name="top" />
    </div>

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
      class="secondary-nav-item"
      v-bind="item"
    />
  </div>
</template>

<script>
import NavItem from '@/components/Sidebar/NavItem.vue'

export default {
  name: 'SubNav',

  components: {
    NavItem,
  },

  props: {
    title: {
      type: String,
      required: false,
      default: '',
    },

    items: {
      type: Array,
      required: true,
    },

    titleLink: {
      type: String,
      required: false,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.secondary-nav {
  position: fixed;
  z-index: 4;
  top: var(--topbar-height);
  left: var(--sidebarCollapsedWidth);
  bottom: 0;
  width: var(--subnavWidth);
  overflow-x: auto;
  border-left: 1px solid var(--steel-300);
  background-color: var(--white);
  transition: width 200ms ease-out;
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
  }
}
</style>
