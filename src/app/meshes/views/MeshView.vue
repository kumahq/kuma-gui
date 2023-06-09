<template>
  <RouteView
    v-slot="{
      children
    }"
  >
    {{ children }}
    <AppView>
      <KTabs
        class="route-mesh-view-tabs"
        :tabs="items"
        :has-panels="false"
        :model-value="(items.find(item => children.includes(data.get(item.hash)?.module as string)) ?? items[0]).hash"
      >
        <template
          v-for="item in items"
          :key="`${item.hash}-anchor`"
          #[`${item.hash.substr(1)}-anchor`]
        >
          <router-link
            :to="{
              name: item.hash.substr(1),
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
import { KTabs, Tab } from '@kong/kongponents'
import { useRouter } from 'vue-router'

import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const router = useRouter()
const c = router.getRoutes().find((route) => route.name === 'mesh-abstract-view')?.children ?? []

const meshRoutes = c[0].children ?? []
const data: Map<string, {module: string | undefined}> = new Map()
const items: Tab[] = meshRoutes.map((item) => {
  const name = String(item.name)
  data.set(`#${name}`, {
    module: item?.meta?.module,
  })
  return {
    title: t(`meshes.routes.item.navigation.${name}`),
    hash: `#${name}`,
  }
})
</script>
