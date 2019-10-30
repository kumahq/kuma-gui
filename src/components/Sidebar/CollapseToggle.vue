<template>
  <div
    class="sidebar-toggle"
    @click="handleToggleCollapse"
  >
    <KIcon
      icon="collapseExpand"
      size="16"
      view-box="0 0 16 16"
    />
    <span>
      <slot name="toggle-text">Collapse Sidebar</slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'CollapseToggle',
  props: {
    isCollapsed: {
      type: Boolean,
      default: false
    },
    handleToggleCollapse: {
      type: Function,
      default: () => {}
    }
  }
}
</script>

<style lang='scss' scoped>
.sidebar-toggle {
  height: 36px;
  width: 240px;
  position: fixed;
  bottom: 0;
  line-height: 0; // adjust centered text for ie11
  border-right: 1px solid #e6e7e8;
  border-bottom: 0;
  cursor: pointer;
  z-index: 2;
  svg {
    transition: all 0.2s ease;
  }

  nav.closed & {
    border-right: none;
    width: 63px;
    svg {
      transform: rotate(180deg);
    }
  }

  @media only screen and (max-width: 900px) {
    display: none;
  }
}
</style>
