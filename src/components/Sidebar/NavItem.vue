<template>
  <div
    class="nav-item"
    :class="[
      { 'is-active': isActive },
      { 'is-menu-item': isMenuItem },
      { 'is-disabled': isDisabled },
      { 'is-title': title },
      { 'is-nested': nested },
      { 'nav-item--is-primary': !isSecondary },
      { 'nav-item--is-secondary': isSecondary },
    ]"
    :data-testid="link"
  >
    <router-link
      :to="routerLink"
      @click="onNavItemClick"
    >
      <div
        v-if="hasIcon || hasCustomIcon"
        class="nav-icon"
      >
        <slot name="item-icon">
          <KIcon
            v-if="hasIcon && icon"
            color="var(--SidebarIconColor)"
            :icon="icon"
          />
        </slot>
      </div>

      <div
        v-if="title"
        class="title-text"
      >
        <span class="text-uppercase">
          {{ name }}
        </span>
      </div>

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
    usesMeshParam: {
      type: Boolean,
      required: false,
      default: false,
    },
    isSecondary: {
      type: Boolean,
      required: false,
      default: true,
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
      const targetRoute = {}

      if (this.link) {
        targetRoute.name = this.link
      } else if (this.title) {
        targetRoute.name = null
      } else {
        targetRoute.name = this.$route.name
      }

      // Sets `mesh` params only if route actually has `mesh` param defined.
      // See: https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22
      if (this.usesMeshParam) {
        targetRoute.params = { mesh: this.selectedMesh }
      }

      return targetRoute
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
      padding: var(--spacing-xxs) var(--spacing-md);
    }
  }
}
.nav-item--is-primary.is-active::before {
  content: '';
  position: absolute;
  display: block;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: var(--SidebarIconColor);
}

.nav-item--is-secondary {
  margin: 0 0 var(--spacing-xxs) var(--subnavHorizontalMargin);
  border-radius: 5px;

  &:hover {
    background: var(--SidebarLinkBGColor);
  }

  &.is-active {
    font-weight: 500;
    background-color: var(--SidebarLinkBGColor);
  }
}

.nav-icon {
  display: flex;
  align-items: center;
  color: var(--SidebarIconColor);
  padding-right: var(--spacing-lg);
}

.amount {
  position: absolute;
  top: 0;
  right: 8px;
  bottom: 0;
  width: 1.5rem;
  height: 1.25rem;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #fff;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 400;
  background-color: var(--gray-2);
}

.amount--empty {
  background-color: var(--gray-4);
}
</style>
