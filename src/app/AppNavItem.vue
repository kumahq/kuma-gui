<template>
  <div
    class="nav-item"
    :class="{
      [`nav-item-${props.routeName}`]: props.routeName !== '',
      'nav-item--is-category': targetRoute === null,
      [`nav-item--is-${props.categoryTier}-category`]: props.categoryTier !== null,
    }"
    :data-testid="props.routeName || undefined"
  >
    <router-link
      v-if="targetRoute !== null"
      class="nav-link"
      :class="{ 'nav-link--is-active': isActive }"
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
      class="nav-category"
    >
      {{ name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { datadogLogs } from '@datadog/browser-logs'
import { computed, PropType } from 'vue'
import { useRoute, useRouter, RouteLocationNamedRaw } from 'vue-router'

import { useStore } from '@/store/store'
import { datadogLogEvents } from '@/utilities/datadogLogEvents'
import { get } from '@/utilities/get'

const currentRoute = useRoute()
const router = useRouter()
const store = useStore()

const props = defineProps({
  name: {
    type: String,
    required: true,
  },

  routeName: {
    type: String,
    required: false,
    default: '',
  },

  usesMeshParam: {
    type: Boolean,
    required: false,
    default: false,
  },

  categoryTier: {
    type: String as PropType<'primary' | 'secondary'>,
    required: false,
    default: null,
  },

  insightsFieldAccessor: {
    type: String,
    required: false,
    default: '',
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
  if (props.routeName === '') {
    return null
  }

  const targetRoute: RouteLocationNamedRaw = {
    name: props.routeName,
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

  if (props.routeName === currentRoute.name) {
    return true
  }

  const currentRouteSubpath = currentRoute.path.split('/')[2]
  if (currentRouteSubpath === targetRoute.value.name) {
    return true
  }

  if (currentRoute.meta.parent) {
    try {
      const parentRoute = router.resolve({ name: currentRoute.meta.parent })

      if (parentRoute.name === props.routeName) {
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

  return props.routeName && currentRoute.matched.some((route) => props.routeName === route.name || props.routeName === route.redirect)
})

function onNavItemClick() {
  datadogLogs.logger.info(datadogLogEvents.SIDEBAR_ITEM_CLICKED, { data: targetRoute.value })
}
</script>

<style lang="scss" scoped>
.nav-item {
  position: relative;
  margin-left: var(--spacing-xs);
}

.nav-item:not(:first-child) {
  margin-top: var(--spacing-xxs);
}

.nav-item--is-primary-category {
  font-size: var(--type-md);
  text-transform: uppercase;
}

.nav-item--is-primary-category:not(:first-child) {
  margin-top: var(--spacing-lg);
}

.nav-item--is-secondary-category {
  margin-left: var(--spacing-md);
}

.nav-item--has-bottom-offset {
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-xs);
  border-bottom: var(--KCardBorder);
}

.nav-link {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: 5px;
  text-decoration: none;
  color: currentColor;
}

.nav-link:hover,
.nav-link--is-active {
  background-color: var(--grey-300);
}

.nav-category {
  padding-top: var(--spacing-xs);
  padding-bottom: var(--spacing-xs);
  font-weight: 600;
}

.amount {
  width: 1.5rem;
  height: 1.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--white);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: normal;
  background-color: var(--purple-100);
}

.amount--empty {
  background-color: var(--grey-200);
}
</style>
