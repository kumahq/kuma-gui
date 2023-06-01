<template>
  <KTabs
    class="route-mesh-view-tabs"
    :tabs="items"
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
    v-slot="{Component, route}"
  >
    <component
      :is="Component"
      :key="route.path"
    />
  </RouterView>
</template>

<script lang="ts" setup>
import { KTabs } from '@kong/kongponents'
import { useRouter } from 'vue-router'

import { useI18n } from '@/utilities'

const { t } = useI18n()
const router = useRouter()

const meshRoutes = router.getRoutes().find((route) => route.name === 'mesh-abstract-view')?.children ?? []
const items = meshRoutes.map((item) => {
  if (typeof item.name === 'undefined') {
    const route = item.children?.[0]
    const name = String(route?.name)

    return {
      title: t(`meshes.navigation.${name}`),
      hash: name,
    }
  }
  const name = String(item.name)
  return {
    title: t(`meshes.navigation.${name}`),
    hash: name,
  }
})
</script>

<style scoped>
.tab-link a {
  display: block;
  padding: var(--spacing-md);
  text-decoration: none;
  color: var(--KTabsColor)
}

li.active .tab-link a {
  color: var(--KTabsActiveColor)
}
</style>

<style lang="scss">
.route-mesh-view-tabs > ul .tab-item {
  padding: 0 !important;
}
</style>
