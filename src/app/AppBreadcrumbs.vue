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
  const items: Map<RouteRecordName, BreadcrumbItem> = new Map()

  for (const matchedRoute of route.matched) {
    // Ignores the de-facto home page.
    if (matchedRoute.name === 'home' || matchedRoute.meta.parent === 'home') {
      continue
    }

    // Adds any explicit parent routes of the matched chain.
    if (matchedRoute.meta.parent !== undefined) {
      const parentRoute = router.resolve({ name: matchedRoute.meta.parent })

      if (parentRoute.name) {
        items.set(parentRoute.name, {
          to: parentRoute,
          key: parentRoute.name as string,
          title: parentRoute.meta.title,
          text: parentRoute.meta.title,
        })
      }
    }

    // Adds current route.
    const isCurrentRoute = matchedRoute.name === route.name || matchedRoute.redirect === route.name
    if (isCurrentRoute && matchedRoute.meta.breadcrumbExclude !== true && route.name) {
      let title = route.meta.title as string

      if (typeof route.meta.getBreadcrumbTitle === 'function') {
        title = route.meta.getBreadcrumbTitle(route, store)
      } else if (route.meta.breadcrumbTitleParam && route.params[route.meta.breadcrumbTitleParam]) {
        title = route.params[route.meta.breadcrumbTitleParam] as string
      }

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
</script>
