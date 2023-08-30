<template>
  <RouteView
    v-slot="{ route }"
    name="data-plane-detail-view"
    data-testid="data-plane-detail-view"
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
            name: `${props.isGatewayView ? 'gateways' : 'data-planes'}-list-view`,
            params: {
              mesh: route.params.mesh,
            },
          },
          text: t(`${props.isGatewayView ? 'gateways' : 'data-planes'}.routes.item.breadcrumbs`)
        },
      ]"
    >
      <template #title>
        <h1>
          <TextWithCopyButton :text="route.params.dataPlane">
            <RouteTitle
              :title="t(`${props.isGatewayView ? 'gateways' : 'data-planes'}.routes.item.title`, { name: route.params.dataPlane })"
              :render="true"
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

        <DataPlaneDetails
          v-else
          :dataplane-overview="data"
          data-testid="detail-view-details"
        />
      </DataSource>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import DataPlaneDetails from '../components/DataPlaneDetails.vue'
import type { DataplaneOverviewSource } from '../sources'
import AppView from '@/app/application/components/app-view/AppView.vue'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import { useI18n } from '@/utilities'

const { t } = useI18n()

const props = defineProps({
  isGatewayView: {
    type: Boolean,
    required: false,
    default: false,
  },
})
</script>
