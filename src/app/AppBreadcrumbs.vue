<template>
  <KBreadcrumbs
    v-if="breadcrumbItems.length > 0"
    :items="breadcrumbItems"
  />
</template>

<script lang="ts" setup>
import { KBreadcrumbs } from '@kong/kongponents'
import { computed } from 'vue'
import { useRoute, useRouter, RouteLocation, RouteRecordName } from 'vue-router'

import { useStore } from '@/store/store'

const route = useRoute()
const router = useRouter()
const store = useStore()

type BreadcrumbItem = {
  to: RouteLocation | string
  text?: string
  title?: string
  icon?: string
  key?: string
  maxWidth?: string
}

const breadcrumbItems = computed(() => {
  const items = new Map<RouteRecordName, BreadcrumbItem>()

  for (const matchedRoute of route.matched) {
    // Ignores the de-facto home page.
    if (matchedRoute.name === 'home' || matchedRoute.meta.parent === 'home') {
      continue
    }

    // Adds any explicit parent routes of the matched chain.
    if (matchedRoute.meta.parent !== undefined) {
      const parentRoutes = getParentRoutes(matchedRoute.meta.parent)

      for (const parentRoute of parentRoutes) {
        const title = getRouteTitle(parentRoute)

        if (parentRoute.name) {
          items.set(parentRoute.name, {
            to: parentRoute,
            key: parentRoute.name as string,
            title,
            text: title,
          })
        }
      }
    }

    // Adds current route.
    const isCurrentRoute = matchedRoute.name === route.name || matchedRoute.redirect === route.name
    if (isCurrentRoute && matchedRoute.meta.breadcrumbExclude !== true && route.name) {
      const title = getRouteTitle(route)

      items.set(route.name, {
        to: route,
        key: route.name as string,
        title,
        text: title,
      })
    }
  }

  return Array.from(items.values())
})

/**
 * Recursively constructs a list (chain) of parent routes starting with a route’s parent name and working itself upwards the route tree.
 */
function getParentRoutes(parentRouteName: string): RouteLocation[] {
  const parentRoutes: RouteLocation[] = []
  const parentRoute = router.resolve({ name: parentRouteName })

  if (parentRoute.name) {
    if (parentRoute.meta.parent !== undefined) {
      parentRoutes.push(...getParentRoutes(parentRoute.meta.parent))
    }

    parentRoutes.push(parentRoute)
  }

  return parentRoutes
}

function getRouteTitle(route: RouteLocation): string {
  if (typeof route.meta.getBreadcrumbTitle === 'function') {
    return route.meta.getBreadcrumbTitle(route, store)
  } else if (route.meta.breadcrumbTitleParam && route.params[route.meta.breadcrumbTitleParam]) {
    return route.params[route.meta.breadcrumbTitleParam] as string
  } else {
    return route.meta.title as string
  }
}
</script>
