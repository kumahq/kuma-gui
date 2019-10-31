<template>
  <ul class="menu-list">
    <template v-for="item in menuItems">
      <li
        v-if="!item.hidden"
        :key="item.name"
        :class="{'menu-title' : item.title, 'hasBadge': item.badge}"
      >
        <router-link
          v-if="item.link"
          :to="{ path: '/' + workspace + preparePath(item.link) }"
        >
          {{ item.name }}
          <!-- <span
            v-if="item.badge"
            class="badge"
          >{{ item.badge }}</span> -->
          <!-- <span
            v-if="item.badgeSecondary"
            class="badge secondary"
          >{{ item.badgeSecondary }}</span> -->
        </router-link>
        <span v-else-if="!item.hidden">{{ item.name }}</span>
      </li>
    </template>
  </ul>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MenuList',
  props: {
    menuItems: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapState('workspaces', {
      workspace: state => state.workspace
    })
  },
  methods: {
    preparePath (path) {
      return path[0] === '/' ? path : `/${path}`
    }
  }
}
</script>

<style lang='scss'>
.menu-list {
  display: block;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  white-space: nowrap;

  li {
    position: relative;
    line-height: 38px;
    cursor: pointer;

    &.menu-title {
      font-size: 12px;
      font-weight: normal;
      color: #000;
      text-transform: uppercase;
      padding: 0 32px;
    }

    a {
      display: block;
      padding: 0 32px;
      font-size: 16px;
      text-decoration: none;
      color: rgba(0, 0, 0, 0.7);
      transition: all 300ms ease;
    }

    &:not(.menu-title) {

      &:hover a {
        color: #000;
        text-decoration: underline;
      }

      .router-link-active {
        position: relative;
        z-index: 1;
        color: #1270b2;
        border-right: 1px solid var(--blue-2);
        background: var(--blue-3);

        // &:after {
        //   position: absolute;
        //   display: block;
        //   content: '';
        //   top: 0;
        //   left: -64px;
        //   width: 100%;
        //   height: 100%;
        //   border-right: 1px solid var(--blue-2);
        //   background: var(--blue-3);
        //   z-index: -1;
        // }
      }
    }

    &:hover a {
      color: #1270b2;
    }
  }

  nav.closed & {
    display: none;

    li {
      padding: 0 1rem;
      transition: all 0.3s ease;

      &:not(.menu-title) {

        .router-link-active:after {
          width: calc(100% + 2em);
          border: 0;
          left: -1rem;
        }
      }
    }
  }
}

</style>
