<template>
  <div
    class="nav-item"
    :class="[
      { 'nav-item--is-active': isActive },
      { 'nav-item--is-link': targetRoute !== null },
    ]"
    :data-testid="link"
  >
    <router-link
      v-if="targetRoute !== null"
      class="nav-item__link"
      :to="targetRoute"
      @click="onNavItemClick"
    >
      {{ name }}

      <span
        v-if="amount"
        class="amount"
        :class="{ 'amount--empty': amount === '0' }"
      >
        {{ amount }}
      </span>
    </router-link>

    <div
      v-else
      class="nav-item__title"
    >
      <span class="text-uppercase">
        {{ name }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter, RouteLocationNamedRaw } from 'vue-router'
import { datadogLogs } from '@datadog/browser-logs'
import { datadogLogEvents } from '@/datadogEvents'

import { useStore } from '@/store/store'
import { get } from '@/utils/get'

const route = useRoute()
const router = useRouter()
const store = useStore()

const props = defineProps({
  link: {
    type: String,
    required: false,
    default: '',
  },

  insightsFieldAccessor: {
    type: String,
    required: false,
    default: '',
  },

  name: {
    type: String,
    required: false,
    default: '',
  },

  usesMeshParam: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const amount = computed(() => {
  if (props.insightsFieldAccessor) {
    const value = get(store.state.sidebar.insights, props.insightsFieldAccessor, 0)
    return value > 99 ? '99+' : String(value)
  } else {
    return ''
  }
})

const targetRoute = computed<RouteLocationNamedRaw | null>(() => {
  if (props.link === '') {
    return null
  }

  const targetRoute: RouteLocationNamedRaw = {
    name: props.link,
  }

  // Sets `mesh` params only if route actually has `mesh` param defined.
  // See: https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22
  if (props.usesMeshParam) {
    targetRoute.params = {
      mesh: store.state.selectedMesh,
    }
  }

  return targetRoute
})

const isActive = computed(() => {
  if (targetRoute.value === null) {
    return false
  }

  if (props.link === route.name) {
    return true
  }

  const currentRouteSubpath = route.path.split('/')[2]
  if (currentRouteSubpath === targetRoute.value.name) {
    return true
  }

  if (route.meta.parent) {
    try {
      const parentRoute = router.resolve({ name: route.meta.parent })

      if (parentRoute.name === props.link) {
        return true
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('No match for')) {
        // Unfortunately, `router.resolve` throws instead of returning `null` when a route can’t be resolved so we ignore this particular error because we don’t care about non-existing routes here.
        console.warn(error)
      } else {
        throw error
      }
    }
  }

  return props.link && route.matched.some((r) => props.link === r.name || props.link === r.redirect)
})

function onNavItemClick() {
  datadogLogs.logger.info(datadogLogEvents.SIDEBAR_ITEM_CLICKED, { data: targetRoute.value })
}
</script>

<style lang="scss" scoped>
.nav-item {
  position: relative;
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  margin-left: var(--spacing-xs);
  margin-bottom: var(--spacing-xxs);
  border-radius: 5px;
}

.nav-item--is-active {
  font-weight: 500;
  background-color: var(--SidebarLinkBGColor);
}

.nav-item--is-link:hover {
  background: var(--SidebarLinkBGColor);
}

.nav-item__title {
  margin-left: var(--spacing-xs);
  padding-top: var(--spacing-xs);
  padding-bottom: var(--spacing-xs);
  font-weight: 500;
  font-size: var(--type-sm);
  color: var(--SidebarTitleColor);
}

.nav-item__link {
  display: flex;
  width: 100%;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-md);
  text-decoration: none;
  color: var(--SidebarLinkColor);
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
