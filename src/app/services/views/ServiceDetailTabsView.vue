<template>
  <RouteView
    v-slot="{ route }"
    name="service-detail-tabs-view"
    data-testid="service-detail-tabs-view"
  >
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'mesh-detail-view',
            params: {
              mesh: route.params.mesh,
            },
          },
          text: route.params.mesh,
        },
        {
          to: {
            name: 'services-list-view',
            params: {
              mesh: route.params.mesh,
            },
          },
          text: t('services.routes.item.breadcrumbs')
        },
      ]"
    >
      <template #title>
        <h1>
          <TextWithCopyButton :text="route.params.service">
            <RouteTitle
              :title="t('services.routes.item.title', { name: route.params.service })"
              :render="true"
            />
          </TextWithCopyButton>
        </h1>
      </template>

      <DataSource
        v-slot="{ data, error }: ServiceInsightSource"
        :src="`/meshes/${route.params.mesh}/service-insights/${route.params.service}`"
      >
        <ErrorBlock
          v-if="error"
          :error="error"
        />

        <LoadingBlock v-else-if="data === undefined" />

        <template v-else>
          <NavTabs
            class="route-service-detail-view-tabs"
            :tabs="getNavTabs(data)"
          />

          <RouterView v-slot="child">
            <component
              :is="child.Component"
              :data="data"
            />
          </RouterView>
        </template>
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { RouteRecordRaw, useRouter } from 'vue-router'

import type { ServiceInsightSource } from '../sources'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import NavTabs, { NavTab } from '@/app/common/NavTabs.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { ServiceInsight } from '@/types/index.d'
import { useI18n } from '@/utilities'

const { t } = useI18n()
const router = useRouter()

function getNavTabs(serviceInsight: ServiceInsight): NavTab[] {
  const routes = router.getRoutes().find((route) => route.name === 'service-detail-tabs-view')?.children ?? []

  return routes
    .filter((route) => {
      if (serviceInsight.serviceType === 'external' && route.name === 'service-data-plane-proxies-view') {
        return false
      }

      return true
    })
    .map((route) => {
      const referenceRoute = typeof route.name === 'undefined' ? route.children?.[0] as RouteRecordRaw : route
      const routeName = referenceRoute.name as string
      const module = referenceRoute.meta?.module ?? ''
      const title = t(`services.routes.item.navigation.${routeName}`)

      return { title, routeName, module }
    })
}
</script>
