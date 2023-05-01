<template>
  <KBreadcrumbs
    v-if="breadcrumbItems.length > 0"
    :items="breadcrumbItems"
  />
</template>

<script lang="ts" setup>
import { KBreadcrumbs, BreadcrumbItem } from '@kong/kongponents'
import { computed } from 'vue'
import { useRoute, useRouter, RouteLocationNormalizedLoaded, RouteLocationMatched, RouteLocationNamedRaw } from 'vue-router'

import { useStore } from '@/store/store'

const route = useRoute()
const router = useRouter()
const store = useStore()

const breadcrumbItems = computed(() => {
  return route.matched
    .filter((matchedRoute) => matchedRoute.meta.isBreadcrumb === true)
    .map((matchedRoute) => {
      try {
        // In order to link to routes using KBreadcrumbs, we need to resolve the objects in `route.matched`: This is necessary because we can’t pass matched route objects as-is to KBreadcrumbs and have it create correct links. Matched route objects are more akin to route records. Their `path` is unresolved (e.g. `/mesh/:mesh/policies` instead of `/mesh/default/policies`) and they don’t have `params`. Furthermore, while they might be a named route, they are *not* necessarily the correct one: a nested named route with an empty string path will actually be the resolved route and the one we want to navigate to.
        const resolvedRoute = router.resolve(matchedRoute)
        if (typeof resolvedRoute.name === 'string') {
          const to: RouteLocationNamedRaw = { name: resolvedRoute.name }

          return { matchedRoute, to }
        } else {
          return null
        }
      } catch {
        return null
      }
    })
    // Filters out `null` objects with a type predicate so the subsequent `map` call knows the item can’t be `null`.
    .filter(notNull)
    .map(({ matchedRoute, to }) => {
      const title = getRouteTitle(matchedRoute, route)
      const text = title

      const breadcrumbItem: BreadcrumbItem = {
        to,
        title,
        text,
      }

      return breadcrumbItem
    })
})

function notNull<TValue>(value: TValue | null): value is TValue {
  return value !== null
}

function getRouteTitle(matchedRoute: RouteLocationMatched, currentRoute: RouteLocationNormalizedLoaded): string {
  if (typeof matchedRoute.meta.getBreadcrumbTitle === 'function') {
    return matchedRoute.meta.getBreadcrumbTitle(currentRoute, store)
  } else if (matchedRoute.meta.breadcrumbTitleParam && currentRoute.params[matchedRoute.meta.breadcrumbTitleParam]) {
    return currentRoute.params[matchedRoute.meta.breadcrumbTitleParam] as string
  } else {
    return matchedRoute.meta.title as string
  }
}
</script>
