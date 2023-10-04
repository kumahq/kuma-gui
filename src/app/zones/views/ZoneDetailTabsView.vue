<template>
  <RouteView
    v-slot="{ can, route }"
    name="zone-cp-detail-tabs-view"
    :params="{
      zone: ''
    }"
  >
    <DataSource
      v-slot="{ data, error }: ZoneOverviewSource"
      :src="`/zone-cps/${route.params.zone}`"
      @change="change"
    >
      <ErrorBlock
        v-if="error !== undefined"
        :error="error"
      />

      <LoadingBlock v-else-if="data === undefined" />

      <template v-else>
        <AppView
          :breadcrumbs="[
            {
              to: {
                name: 'zone-cp-list-view',
              },
              text: t('zone-cps.routes.item.breadcrumbs')
            },
          ]"
        >
          <template #title>
            <h1>
              <TextWithCopyButton :text="route.params.zone">
                <RouteTitle
                  :title="t('zone-cps.routes.item.title', { name: route.params.zone })"
                  :render="true"
                />
              </TextWithCopyButton>
            </h1>
          </template>

          <template
            v-if="can('create zones')"
            #actions
          >
            <ZoneActionMenu :zone-overview="data" />
          </template>

          <NavTabs
            class="route-zone-detail-view-tabs"
            :tabs="tabs"
          />

          <RouterView v-slot="child">
            <component
              :is="child.Component"
              :data="data"
              :notifications="notifications"
            />
          </RouterView>
        </AppView>
      </template>
    </DataSource>
  </RouteView>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { RouteRecordRaw, useRouter } from 'vue-router'

import ZoneActionMenu from '../components/ZoneActionMenu.vue'
import { ZoneOverview, ZoneOverviewSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import NavTabs, { NavTab } from '@/app/common/NavTabs.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()
const router = useRouter()

const routes = router.getRoutes().find((route) => route.name === 'zone-cp-detail-tabs-view')?.children ?? []
const tabs: NavTab[] = routes.map((route) => {
  const referenceRoute = typeof route.name === 'undefined' ? route.children?.[0] as RouteRecordRaw : route
  const routeName = referenceRoute.name as string
  const module = referenceRoute.meta?.module ?? ''
  const title = t(`zone-cps.routes.item.navigation.${routeName}`)

  return { title, routeName, module }
})
const notifications = ref<{kind: string, payload: Record<string, string>}[]>([])

const change = (data: ZoneOverview) => {
  const warnings = []
  const subscriptions = data.zoneInsight?.subscriptions ?? []

  if (subscriptions.length > 0) {
    const lastSubscription = subscriptions[subscriptions.length - 1]
    const kumaCpVersion = lastSubscription.version.kumaCp.version || '-'
    const { kumaCpGlobalCompatible = true } = lastSubscription.version.kumaCp

    if (lastSubscription.config && JSON.parse(lastSubscription.config)?.store.type === 'memory') {
      warnings.push({
        kind: 'ZONE_STORE_TYPE_MEMORY',
        payload: {},
      })
    }
    if (!kumaCpGlobalCompatible) {
      warnings.push({
        kind: 'INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS',
        payload: {
          zoneCpVersion: kumaCpVersion,
        },
      })
    }
  }

  notifications.value = warnings
}

</script>
