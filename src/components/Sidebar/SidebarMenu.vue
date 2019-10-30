<template>
  <div
    :class="{'first': index == 0, 'last': isLast}"
    class="menu-wrapper"
    @mouseout="_isHovering(false)"
    @mouseover="_isHovering(true)"
  >
    <div
      :class="{'active' : isMenuActive}"
      class="icon"
    >
      <!-- <KIcon :icon="menu.id" /> -->
    </div>
    <div class="item-wrapper">
      <MenuList
        :menu-items="menu.items"
      />
    </div>
  </div>
</template>

<script>
import MenuList from './MenuList'

export default {
  name: 'SidebarMenu',
  components: {
    MenuList
  },

  props: {
    menu: {
      type: Object,
      required: true
    },
    triggerHovering: {
      type: Function,
      required: false,
      default: () => {}
    },
    index: {
      type: Number,
      required: true
    },
    isLast: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      hovering: false
    }
  },

  computed: {
    isMenuActive () {
      return this.menu.items.some(item => this.$route.path.indexOf(item.link) !== -1)
    }
  },

  methods: {
    _isHovering (isHovering) {
      this.triggerHovering(isHovering)
      this.hovering = isHovering
    }
  }
}
</script>

<style lang='scss'>
.menu-wrapper {
  display: flex;
  position: relative;
  margin-bottom: 24px;

  &.first {
    margin: 24px 0 0;
  }
  &.last {
    margin-bottom: 45px;
  }
  .icon {
    color: #dcddde;
    padding: .5rem 1.2rem;
    cursor: pointer;
    z-index: 2;
    svg {
      margin-top: 0.5rem;
      path {
        transition: all 0.2s ease;
      }
    }
    &.active {
      svg > path {
        fill: #1272B0;
      }
    }
  }
  .item-wrapper {
    width: 100%;
    margin-top: 0.5rem;
  }

  nav.closed & {
    margin-bottom: 0;
    .icon.active {
      border-right: 2px solid #0D93F2;
      background: #EBEFF2;
    }
    &:hover {
      .icon {
        svg > path {
          fill: #1272B0;
        }
      }
      .item-wrapper {
        position: fixed;
        display: inline-block;
        left: 63px;
        width: auto;
        margin-top: 0;
        .icon {
          display: inline-block;
        }
        .menu-list {
          display: block;
          width: 160px;
          padding: 1rem 0;
          margin-left: 8px;
          border-radius: 4px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: #fff;
          z-index: 100;
        }
      }
    }
  }
}

</style>
