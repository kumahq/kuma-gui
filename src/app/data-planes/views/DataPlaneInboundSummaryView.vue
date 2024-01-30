<template>
  <RouteView
    v-slot="{ route }"
    name="data-plane-inbound-summary-view"
    :params="{
      service: '',
    }"
  >
    <AppView>
      <template #title>
        <h2>
          <template v-if="props.gateway">
            {{ route.params.service }}
          </template>

          <template v-else>
            Inbound :{{ route.params.service.replace('localhost_', '') }}
          </template>
        </h2>
      </template>

      <NavTabs
        :tabs="tabs"
      />
      <RouterView v-slot="child">
        <component
          :is="child.Component"
          v-if="props.gateway"
          :gateway="props.gateway"
        />

        <DataCollection
          v-else
          v-slot="{ items }"
          :items="props.inbounds"
          :predicate="(item) => `localhost_${item.port}` === route.params.service"
          :find="true"
        >
          <component
            :is="child.Component"
            :inbound="items[0]"
            :gateway="props.gateway"
          />
        </DataCollection>
      </RouterView>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { RouteRecordRaw, useRouter } from 'vue-router'

import type { DataplaneGateway, DataplaneInbound } from '../data'
import { useI18n } from '@/app/application'
import NavTabs, { NavTab } from '@/app/common/NavTabs.vue'

const { t } = useI18n()
const router = useRouter()

const props = defineProps<{
  dataplaneType: 'standard' | 'builtin'
  gateway?: DataplaneGateway
  inbounds: DataplaneInbound[]
}>()

const routes = router.getRoutes().find((route) => route.name === 'data-plane-inbound-summary-view')?.children ?? []
const tabs: NavTab[] = routes.map((route) => {
  const referenceRoute = typeof route.name === 'undefined' ? route.children?.[0] as RouteRecordRaw : route
  const routeName = referenceRoute.name as string
  const module = referenceRoute.meta?.module ?? ''
  const title = t(`data-planes.routes.item.navigation.${routeName}`)

  return { title, routeName, module }
})

</script>
