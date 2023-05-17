<template>
  <KTabs
    :tabs="items"
    :model-value="(items.find(item => (router.currentRoute?.value.name ?? '').toString().startsWith(item.hash)) ?? items[0]).hash"
    @click="change"
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
    <template
      v-for="item in items"
      :key="item.hash"
      #[item.hash]
    >
      <RouterView
        v-slot="routerView"
      >
        <component
          :is="routerView.Component"
          :key="routerView.route.path"
        />
      </RouterView>
    </template>
  </KTabs>
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
const change = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.nodeName.toLowerCase() !== 'a') {
    e.preventDefault()
    target.querySelector('a')?.click()
  }
}
</script>
<style scoped>
.tab-link a {
  text-decoration: none;
  color: var(--KTabsColor)
}
li.active .tab-link a {
  color: var(--KTabsActiveColor)
}
</style>
