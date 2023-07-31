<template>
  <RouteView>
    <AppView>
      <NavTabs
        class="route-mesh-view-tabs"
        :tabs="tabs"
      />

      <RouterView v-slot="child">
        <component
          :is="child.Component"
          :key="child.route.path"
        />
      </RouterView>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { useRouter, RouteRecordRaw } from 'vue-router'

import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import NavTabs, { NavTab } from '@/app/common/NavTabs.vue'
import { useI18n } from '@/utilities'

const i18n = useI18n()
const router = useRouter()

const meshRoutes = router.getRoutes().find((route) => route.name === 'mesh-tabs-view')?.children ?? []
const tabs: NavTab[] = meshRoutes.map((route) => {
  const referenceRoute = typeof route.name === 'undefined' ? route.children?.[0] as RouteRecordRaw : route
  const routeName = referenceRoute.name as string
  const module = referenceRoute.meta?.module ?? ''
  const title = i18n.t(`meshes.routes.item.navigation.${routeName}`)

  return { title, routeName, module }
})
</script>
