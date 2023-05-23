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

const router = useRouter()
const items = [
  {
    hash: 'mesh-detail-view',
    title: 'Overview',
  },
  {
    hash: 'services-list-view',
    title: 'Services',
  },
  {
    hash: 'gateways-list-view',
    title: 'Gateways',
  },
  {
    hash: 'data-planes-list-view',
    title: 'Data Plane Proxies',
  },
  {
    hash: 'policies',
    title: 'Policies',
  },
]
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
