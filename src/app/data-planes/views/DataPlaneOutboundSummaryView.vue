<template>
  <RouteView
    v-slot="{ route }"
    name="data-plane-outbound-summary-view"
    :params="{
      service: '',
    }"
  >
    <AppView>
      <template #title>
        <div class="summary-title-wrapper">
          <img
            aria-hidden="true"
            src="@/assets/images/icon-wifi-tethering.svg?url"
          >

          <h2 class="summary-title">
            {{ route.params.service }}
          </h2>
        </div>
      </template>

      <NavTabs
        :tabs="tabs"
      />
      <RouterView v-slot="child">
        <DataCollection
          v-slot="{ items }"
          :items="props.data"
          :predicate="(item) => item.name === route.params.service"
          :find="true"
        >
          <component
            :is="child.Component"
            :data="items[0]"
          />
        </DataCollection>
      </RouterView>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { RouteRecordRaw, useRouter } from 'vue-router'

import type { TrafficEntry } from '../data'
import { useI18n } from '@/app/application'
import NavTabs, { NavTab } from '@/app/common/NavTabs.vue'

const { t } = useI18n()

const router = useRouter()
const props = defineProps<{
  data: TrafficEntry[]
}>()
const routes = router.getRoutes().find((route) => route.name === 'data-plane-outbound-summary-view')?.children ?? []
const tabs: NavTab[] = routes.map((route) => {
  const referenceRoute = typeof route.name === 'undefined' ? route.children?.[0] as RouteRecordRaw : route
  const routeName = referenceRoute.name as string
  const module = referenceRoute.meta?.module ?? ''
  const title = t(`data-planes.routes.item.navigation.${routeName}`)

  return { title, routeName, module }
})

</script>

<style lang="scss" scoped>
.summary-title-wrapper {
  display: flex;
  align-items: baseline;
  gap: $kui-space-30;
  // Accounts for the absolutely-positioned close button
  margin-right: calc($kui-space-30 + 24px);
}

.summary-title {
  margin-top: 0;
}
</style>
