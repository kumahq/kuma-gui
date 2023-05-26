<template>
  <div
    class="nav-item"
    :class="{
      [`nav-item-${props.routeName}`]: props.routeName !== '',
    }"
    :data-testid="props.routeName || undefined"
  >
    <router-link
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
  </div>
</template>

<script lang="ts" setup>
import { datadogLogs } from '@datadog/browser-logs'
import { computed } from 'vue'
import { useRoute, RouteLocationNamedRaw } from 'vue-router'

import { useStore } from '@/store/store'
import { datadogLogEvents } from '@/utilities/datadogLogEvents'
import { get } from '@/utilities/get'

const route = useRoute()
const store = useStore()

const props = defineProps({
  name: {
    type: String,
    required: true,
  },

  routeName: {
    type: String,
    required: true,
  },

  anchorRouteName: {
    type: String,
    required: false,
    default: '',
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

const targetRoute = computed<RouteLocationNamedRaw>(() => ({ name: props.routeName }))

const isActive = computed(() => {
  if (props.routeName === route.name) {
    return true
  }

  const hasAnchorRoute = props.anchorRouteName !== '' && route.matched.some((matchedRoute) => matchedRoute.name === props.anchorRouteName)

  if (hasAnchorRoute) {
    return true
  }

  return false
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

.amount {
  width: 1.5rem;
  height: 1.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--white);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: var(--font-weight-regular);
  background-color: var(--purple-100);
}

.amount--empty {
  background-color: var(--grey-200);
}
</style>
