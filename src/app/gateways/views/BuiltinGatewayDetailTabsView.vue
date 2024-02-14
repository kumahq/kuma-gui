<template>
  <RouteView
    v-slot="{ route }"
    name="builtin-gateway-detail-tabs-view"
    :params="{
      mesh: '',
      gateway: '',
    }"
  >
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'mesh-detail-view',
            params: {
              mesh: route.params.mesh,
            },
          },
          text: route.params.mesh,
        },
        {
          to: {
            name: 'builtin-gateway-list-view',
            params: {
              mesh: route.params.mesh,
            },
          },
          text: t('builtin-gateways.routes.item.breadcrumbs'),
        },
      ]"
    >
      <template #title>
        <h1>
          <TextWithCopyButton :text="route.params.gateway">
            <RouteTitle :title="t('builtin-gateways.routes.item.title', { name: route.params.gateway })" />
          </TextWithCopyButton>
        </h1>
      </template>

      <NavTabs :tabs="tabs" />

      <RouterView />
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { RouteRecordRaw, useRouter } from 'vue-router'

import NavTabs, { NavTab } from '@/app/common/NavTabs.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()
const router = useRouter()

const routes = router.getRoutes().find((route) => route.name === 'builtin-gateway-detail-tabs-view')?.children ?? []
const tabs: NavTab[] = routes
  .map((route) => {
    const referenceRoute = typeof route.name === 'undefined' ? route.children?.[0] as RouteRecordRaw : route
    const routeName = referenceRoute.name as string
    const module = referenceRoute.meta?.module ?? ''
    const title = t(`builtin-gateways.routes.item.navigation.${routeName}`)

    return { title, routeName, module }
  })
</script>
