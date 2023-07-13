<template>
  <RouteView>
    <AppView>
      <NavTabs
        class="route-mesh-view-tabs"
        :tabs="tabs"
      />

      <RouterView
        v-slot="child"
      >
        <component
          :is="child.Component"
          :key="child.route.path"
        />
      </RouterView>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useRoute, useRouter, RouteRecordRaw } from 'vue-router'

import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import NavTabs, { NavTab } from '@/app/common/NavTabs.vue'
import { useStore } from '@/store/store'
import { useI18n } from '@/utilities'

const i18n = useI18n()
const route = useRoute()
const router = useRouter()
const store = useStore()

const meshRoutes = router.getRoutes().find((route) => route.name === 'mesh-detail-view')?.children ?? []
const tabs: NavTab[] = meshRoutes.map((route) => {
  const referenceRoute = typeof route.name === 'undefined' ? route.children?.[0] as RouteRecordRaw : route
  const routeName = referenceRoute.name as string
  const module = referenceRoute.meta?.module ?? ''
  const title = i18n.t(`meshes.routes.item.navigation.${routeName}`)

  return { title, routeName, module }
})

// Updates the policy type totals based on the current mesh.
watch(() => route.params.mesh, (newMesh, oldMesh) => {
  if (newMesh !== oldMesh && newMesh) {
    store.dispatch('fetchPolicyTypeTotals', newMesh)
  }
}, { immediate: true })
</script>
