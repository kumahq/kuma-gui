<template>
  <nav
    id="the-sidebar"
    :class="{ closed: isCollapsed }"
  >
    <slot />
    <slot name="topNavAction" />
    <slot name="topNavTitle" />
    <slot
      :isClosed="isCollapsed"
      :isHovering="triggerHovering"
      name="NavMenu"
    />
    <slot name="NavToggle" />
  </nav>
</template>

<script>
export default {
  name: 'KNav',
  props: {
    isCollapsed: {
      type: Boolean,
      required: true
    },
    triggerHovering: {
      type: Function,
      required: false,
      default: (a) => {}
    }
  }
}
</script>

<style lang='scss' scoped>
nav {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 240px;
  height: auto;
  min-height: 100%;
  border-right: 1px solid #e6e7e8;
  background: #fff;
  z-index: 1000;

  &.closed {
    width: 63px;
  }
}
</style>

<style lang="scss">
nav#the-sidebar + .main-content {
  margin-left: 240px;
}

nav#the-sidebar.closed + .main-content {
  margin-left: 63px;
}
</style>
