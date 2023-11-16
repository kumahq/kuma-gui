<template>
  <RouteView
    v-slot="{ route }"
    name="data-plane-detail-tabs-view"
    :params="{
      mesh: '',
      dataPlane: '',
    }"
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
            name: `${props.isGatewayView ? 'gateway' : 'data-plane'}-list-view`,
            params: {
              mesh: route.params.mesh,
            },
          },
          text: t(`${props.isGatewayView ? 'gateways' : 'data-planes'}.routes.item.breadcrumbs`),
        },
      ]"
    >
      <template #title>
        <h1>
          <TextWithCopyButton :text="route.params.dataPlane">
            <RouteTitle
              :title="t(`${props.isGatewayView ? 'gateways' : 'data-planes'}.routes.item.title`, { name: route.params.dataPlane })"
            />
          </TextWithCopyButton>
        </h1>
      </template>

      <DataSource
        v-slot="{ data, error }: DataplaneOverviewSource"
        :src="`/meshes/${route.params.mesh}/dataplane-overviews/${route.params.dataPlane}`"
      >
        <ErrorBlock
          v-if="error"
          :error="error"
        />

        <LoadingBlock v-else-if="data === undefined" />

        <template v-else>
          <NavTabs
            class="route-data-plane-view-tabs"
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

import { DataplaneOverviewSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import NavTabs, { NavTab } from '@/app/common/NavTabs.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()
const router = useRouter()

const props = defineProps({
  isGatewayView: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const routes = router.getRoutes().find((route) => route.name === `${props.isGatewayView ? 'gateway' : 'data-plane'}-detail-tabs-view`)?.children ?? []
const tabs: NavTab[] = routes.map((route) => {
  const referenceRoute = typeof route.name === 'undefined' ? route.children?.[0] as RouteRecordRaw : route
  const routeName = referenceRoute.name as string
  const module = referenceRoute.meta?.module ?? ''
  const title = t(`${props.isGatewayView ? 'gateways' : 'data-planes'}.routes.item.navigation.${routeName}`)

  return { title, routeName, module }
})
</script>
