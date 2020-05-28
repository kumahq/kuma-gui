<template>
  <nav
    id="the-sidebar"
    :class="{ closed: isCollapsed }"
  >
    <div class="sidebar-inner">
      <slot />
      <slot name="topNavAction" />
      <slot name="topNavTitle" />
      <slot
        :isClosed="isCollapsed"
        :isHovering="triggerHovering"
        name="NavMenu"
      />
      <slot name="NavToggle" />
    </div>
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

<style lang="scss" scoped>
nav {
  position: fixed;

  .sidebar-inner {
    position: relative;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    width: var(--sidebar-width);
    height: auto;
    // min-height: 100%;
    min-height: 100vh;
    border-right: 1px solid #e6e7e8;
    // background: var(--sidebar-bg-color);
  }

  // this is modeled after the Kuma website's sidebar
  &:after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    display: block;
    height: 100%;
    width: 100vw;
    content: "";
    background-color: #fdfdfd;
  }

  &.closed {
    width: var(--sidebar-width-closed);

    .sidebar-inner {
      width: var(--sidebar-width-closed);
    }
  }
}
</style>

<style lang="scss">
nav#the-sidebar + .main-content {
  margin-left: var(--sidebar-width);
}

nav#the-sidebar.closed + .main-content {
  margin-left: var(--sidebar-width-closed);
}
</style>
