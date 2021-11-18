<template>
  <div
    :class="[
      { 'is-active': isActive },
      { 'is-menu-item': isMenuItem },
      { 'is-disabled': isDisabled },
      { 'is-title': title },
      { 'is-nested': nested }
    ]"
    class="nav-item"
    :data-testid="link"
  >
    <router-link
      :to="routerLink"
      @click.native="onNavItemClick"
    >
      <div
        v-if="hasIcon || hasCustomIcon"
        class="nav-icon"
      >
        <slot name="item-icon">
          <KIcon
            v-if="hasIcon && icon"
            width="18"
            height="18"
            view-box="0 0 18 18"
            color="var(--SidebarIconColor)"
            :icon="icon"
          />
        </slot>
      </div>
      <!-- nav title separator -->
      <div
        v-if="title"
        class="title-text"
      >
        <span class="text-uppercase">
          {{ name }}
        </span>
      </div>
      <!-- nav link -->
      <div
        v-else
        class="nav-link"
      >
        <slot name="item-link">
          {{ name }}

          <span
            v-if="insightsFieldAccessor"
            :class="insightsClassess"
          >

            {{ amount }}
          </span>
        </slot>
      </div>
    </router-link>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import get from 'lodash/get'
import { datadogLogs } from '@datadog/browser-logs'
import { datadogLogEvents } from '@/datadogEvents'

export default {
  name: 'NavItem',
  props: {
    link: {
      type: String,
      default: '',
      required: false,
    },
    insightsFieldAccessor: {
      type: String,
      default: '',
      required: false,
    },
    name: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    hasIcon: {
      type: Boolean,
      default: false,
    },
    hasCustomIcon: {
      type: Boolean,
      default: false,
    },
    isMenuItem: {
      type: Boolean,
      default: true,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    title: {
      type: Boolean,
      default: false,
    },
    nested: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      meshPath: null,
    }
  },
  computed: {
    ...mapState({
      selectedMesh: (state) => state.selectedMesh,
      insights: (state) => state.sidebar.insights,
    }),

    insightsClassess() {
      return [
        'amount',
        {
          'amount--empty': this.amount === 0,
        },
      ]
    },
    amount() {
      const value = get(this.insights, this.insightsFieldAccessor, 0)

      if (value > 99) {
        return '99+'
      }

      return value
    },
    routerLink() {
      const params = {
        mesh: this.selectedMesh,
      }

      const link = () => {
        if (this.link) {
          return {
            name: this.link,
            params,
          }
        }

        if (this.title) {
          return {
            name: null,
          }
        }

        return {
          name: this.$route.name,
          params,
        }
      }

      return link()
    },
    isActive() {
      const navItemRouteName = this.link
      const currentRoute = this.$route
      const currentRouteSubpath = this.$route.path.split('/')[2]

      if (navItemRouteName === currentRoute.name) {
        return true
      }

      if (currentRouteSubpath === this.routerLink.name) {
        return true
      }

      return (
        navItemRouteName &&
        currentRoute.matched.some((r) => navItemRouteName === r.name || navItemRouteName === r.redirect)
      )
    },
  },
  methods: {
    onNavItemClick() {
      datadogLogs.logger.info(datadogLogEvents.SIDEBAR_ITEM_CLICKED, { data: this.routerLink })
    },
  },
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
    color: var(--SidebarLinkColor);
    text-decoration: none;
    padding: 8px 20px;
  }

  .nav-icon {
    display: flex;
    padding-right: 20px;
  }

  .title-text {
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: var(--type-sm);
    color: var(--SidebarTitleColor);
  }

  &.is-disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &.is-title {
    a {
      padding-left: 0;
      padding-right: 0;
      pointer-events: none;
    }

    &:hover {
      background: none;
    }
  }

  &.is-nested {
    margin-left: var(--spacing-lg);
    font-size: var(--type-sm);

    a {
      padding: 5px 15px;
    }
  }
}

.amount {
  @apply absolute text-xs font-normal top-0 bottom-0 m-auto rounded w-6 h-5 flex justify-center items-center border border-white;

  background-color: var(--gray-2);
  right: 1px;

  &--empty {
    background-color: var(--gray-4);
  }
}
</style>

<style lang="scss">
// Only add left border to main nav item
.main-nav .nav-item {
  position: relative;

  &:hover:not(.is-active) {
    color: var(--SidebarIconColor);

    svg[class] path {
      fill: var(--SidebarIconColor);
    }
  }

  &.is-active:before {
    position: absolute;
    display: block;
    top: 0;
    bottom: 0;
    width: 3px;
    background-color: var(--SidebarIconColor);
    content: '';
  }
}
</style>
