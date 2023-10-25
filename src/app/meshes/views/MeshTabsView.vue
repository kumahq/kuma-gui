<template>
  <RouteView
    v-slot="{ route }"
    name="mesh-tabs-view"
    :params="{
      mesh: '',
    }"
  >
    <AppView>
      <template #title>
        <h1>
          <TextWithCopyButton :text="route.params.mesh">
            <RouteTitle
              :title="t('meshes.routes.item.title', { name: route.params.mesh })"
              :render="true"
            />
          </TextWithCopyButton>
        </h1>
      </template>

      <NavTabs
        class="route-mesh-view-tabs"
        :tabs="tabs"
      />

      <RouterView />
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { useRouter, RouteRecordRaw } from 'vue-router'

import NavTabs, { NavTab } from '@/app/common/NavTabs.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()
const router = useRouter()

const meshRoutes = router.getRoutes().find((route) => route.name === 'mesh-tabs-view')?.children ?? []
const tabs: NavTab[] = meshRoutes.map((route) => {
  const referenceRoute = typeof route.name === 'undefined' ? route.children?.[0] as RouteRecordRaw : route
  const routeName = referenceRoute.name as string
  const module = referenceRoute.meta?.module ?? ''
  const title = t(`meshes.routes.item.navigation.${routeName}`)

  return { title, routeName, module }
})
</script>
