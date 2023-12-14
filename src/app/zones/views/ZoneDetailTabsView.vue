<template>
  <RouteView
    v-slot="{ can, route }"
    name="zone-cp-detail-tabs-view"
    :params="{
      zone: '',
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
              text: t('zone-cps.routes.item.breadcrumbs'),
            },
          ]"
        >
          <template #title>
            <h1>
              <TextWithCopyButton :text="route.params.zone">
                <RouteTitle
                  :title="t('zone-cps.routes.item.title', { name: route.params.zone })"
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
import type { ZoneOverview } from '../data'
import type { ZoneOverviewSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import NavTabs, { NavTab } from '@/app/common/NavTabs.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import { useI18n } from '@/utilities'
import { get } from '@/utilities/get'

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
  if (data.zoneInsight.store === 'memory') {
    warnings.push({
      kind: 'ZONE_STORE_TYPE_MEMORY',
      payload: {},
    })
  }
  if (!get(data.zoneInsight, 'version.kumaCp.kumaCpGlobalCompatible', 'true')) {
    warnings.push({
      kind: 'INCOMPATIBLE_ZONE_AND_GLOBAL_CPS_VERSIONS',
      payload: {
        zoneCpVersion: get(data.zoneInsight, 'version.kumaCp.version', t('common.collection.none')),
      },
    })
  }
  notifications.value = warnings
}

</script>
