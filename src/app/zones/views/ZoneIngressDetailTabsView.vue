<template>
  <RouteView
    v-slot="{ route }"
    name="zone-ingress-detail-tabs-view"
    data-testid="zone-ingress-detail-tabs-view"
  >
    <AppView
      :breadcrumbs="[
        {
          to: {
            name: 'zone-ingress-list-view',
          },
          text: t('zone-ingresses.routes.item.breadcrumbs')
        },
      ]"
    >
      <template #title>
        <h1>
          <TextWithCopyButton :text="route.params.zoneIngress">
            <RouteTitle
              :title="t('zone-ingresses.routes.item.title', { name: route.params.zoneIngress })"
              :render="true"
            />
          </TextWithCopyButton>
        </h1>
      </template>

      <DataSource
        v-slot="{ data, error }: ZoneIngressOverviewSource"
        :src="`/zone-ingresses/${route.params.zoneIngress}`"
      >
        <ErrorBlock
          v-if="error !== undefined"
          :error="error"
        />

        <LoadingBlock v-else-if="data === undefined" />

        <template v-else>
          <NavTabs
            class="route-zone-ingress-detail-view-tabs"
            :tabs="tabs"
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

import { ZoneIngressOverviewSource } from '../sources'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import NavTabs, { NavTab } from '@/app/common/NavTabs.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()
const router = useRouter()

const routes = router.getRoutes().find((route) => route.name === 'zone-ingress-detail-tabs-view')?.children ?? []
const tabs: NavTab[] = routes.map((route) => {
  const referenceRoute = typeof route.name === 'undefined' ? route.children?.[0] as RouteRecordRaw : route
  const routeName = referenceRoute.name as string
  const module = referenceRoute.meta?.module ?? ''
  const title = t(`zone-ingresses.routes.item.navigation.${routeName}`)

  return { title, routeName, module }
})
</script>
