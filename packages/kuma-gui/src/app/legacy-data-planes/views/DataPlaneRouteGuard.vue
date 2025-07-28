<template>
  <DataLoader
    :data="[isRouteLoaded]"
  >
    <slot />
  </DataLoader>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouteRecordRaw, useRouter } from 'vue-router'

import { useCan } from '@/app/application'
import { dataplaneRoutes } from '@/app/data-planes/routes'
import { legacyDataplaneRoutes } from '@/app/legacy-data-planes/routes'
import { DataPlaneOverview } from '@/types'

const router = useRouter()
const can = useCan()

const props = defineProps<{
  data: DataPlaneOverview
}>()

const isRouteLoaded = ref<boolean | undefined>(undefined)

type RouteWalker = (item: RouteRecordRaw, parent?: RouteRecordRaw) => void
function walkRoutes(walker: RouteWalker, routes: RouteRecordRaw[], parent?: RouteRecordRaw) {
  routes.forEach((item) => {
    walker(item, parent)
    if (typeof item.children !== 'undefined') {
      walkRoutes(walker, item.children, item)
    }
  })
  return routes
}

const addRouteName = (item: RouteRecordRaw) => {
  if (typeof item.name === 'undefined') {
    return
  }
  const props = ((props) => {
    switch (true) {
      case typeof props === 'function':
        return props
      case typeof props === 'undefined':
        return () => ({})
      default:
        return () => props
    }
  })(item.props)
  item.props = (...args) => {
    return {
      ...props(...args),
      routeName: item.name,
    }
  }
}

watch(() => router.currentRoute.value.name, async (val) => {
  if(typeof val === 'string' && val.includes('data-plane-')) {
    isRouteLoaded.value = undefined
    router.removeRoute('data-plane-detail-tabs-view')
    const _routes = walkRoutes(
      addRouteName,
      can('use unified-resource-naming', props.data) ? dataplaneRoutes() : legacyDataplaneRoutes(),
      // can('use unified-resource-naming', props.data) ? dataplaneRoutes().item() : routes().item(),
    )
    router.addRoute('data-plane-root-view', _routes[0])
    await router.replace(router.currentRoute.value.fullPath)
    isRouteLoaded.value = true
  }
}, { immediate: true, once: true })
</script>
