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
    </router-link>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, RouteLocationNamedRaw } from 'vue-router'

import { logEvents } from '@/services/logger/Logger'
import { useLogger } from '@/utilities'

const logger = useLogger()
const route = useRoute()

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
  logger.info(logEvents.SIDEBAR_ITEM_CLICKED, { data: targetRoute.value })
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
</style>
