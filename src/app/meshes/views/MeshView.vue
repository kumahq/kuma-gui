<template>
  <KTabs
    :tabs="items"
    :model-value="(items.find(item => (router.currentRoute?.value.name ?? '').toString().startsWith(item.hash)) ?? items[0]).hash"
    @click="change"
  >
    <template #mesh-detail-view-anchor>
      <router-link
        :to="{
          name: items[0].hash,
        }"
      >
        {{ items[0].title }}
      </router-link>
    </template>
    <template #mesh-detail-view>
      <RouterView
        v-slot="routerView"
      >
        <component
          :is="routerView.Component"
          :key="routerView.route.path"
        />
      </RouterView>
    </template>
    <template #services-list-view-anchor>
      <router-link
        :to="{
          name: items[1].hash,
        }"
      >
        {{ items[1].title }}
      </router-link>
    </template>
    <template #services-list-view>
      <RouterView
        v-slot="routerView"
      >
        <component
          :is="routerView.Component"
          :key="routerView.route.path"
        />
      </RouterView>
    </template>
    <template #gateways-list-view-anchor>
      <router-link
        :to="{
          name: items[2].hash,
        }"
      >
        {{ items[2].title }}
      </router-link>
    </template>
    <template #gateways-list-view>
      <RouterView
        v-slot="routerView"
      >
        <component
          :is="routerView.Component"
          :key="routerView.route.path"
        />
      </RouterView>
    </template>
    <template #data-planes-list-view-anchor>
      <router-link
        :to="{
          name: items[3].hash,
        }"
      >
        {{ items[3].title }}
      </router-link>
    </template>
    <template #data-planes-list-view>
      <RouterView
        v-slot="routerView"
      >
        <component
          :is="routerView.Component"
          :key="routerView.route.path"
        />
      </RouterView>
    </template>
    <template #policies-anchor>
      <router-link
        :to="{
          name: items[4].hash,
        }"
      >
        {{ items[4].title }}
      </router-link>
    </template>
    <template #policies>
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
.tab-link {
  height: 100%;
}
.tab-link a {
  text-decoration: none;
  color: var(--KTabsColor)
}
li.active .tab-link a {
  color: var(--KTabsActiveColor)
}
</style>
