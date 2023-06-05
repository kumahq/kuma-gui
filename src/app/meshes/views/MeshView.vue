<template>
  <RouteView>
    <AppView>
      <KTabs
        class="route-mesh-view-tabs"
        :tabs="items"
        :has-panels="false"
        :model-value="(items.find(item => (router.currentRoute?.value.name ?? '').toString().startsWith(item.hash)) ?? items[0]).hash"
      >
        <template
          v-for="item in items"
          :key="`${item.hash}-anchor`"
          #[`${item.hash}-anchor`]
        >
          <router-link
            :to="{
              name: item.hash,
            }"
          >
            {{ item.title }}
          </router-link>
        </template>
      </KTabs>

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
import { KTabs } from '@kong/kongponents'
import { useRouter } from 'vue-router'

import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()
const router = useRouter()

const meshRoutes = router.getRoutes().find((route) => route.name === 'mesh-abstract-view')?.children ?? []
const items = meshRoutes.map((item) => {
  if (typeof item.name === 'undefined') {
    const route = item.children?.[0]
    const name = String(route?.name)

    return {
      title: t(`meshes.routes.item.navigation.${name}`),
      hash: name,
    }
  }
  const name = String(item.name)
  return {
    title: t(`meshes.routes.item.navigation.${name}`),
    hash: name,
  }
})
</script>
