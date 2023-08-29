<template>
  <RouteView
    name="data-plane-stats-view"
    data-testid="data-plane-stats-view"
  >
    <AppView>
      <template #title>
        <h2>
          <RouteTitle
            :title="t('data-planes.routes.item.navigation.data-plane-stats-view')"
            :render="true"
          />
        </h2>
      </template>

      <KCard>
        <template #body>
          <EnvoyData
            :status="getStatusAndReason(props.data.dataplane, props.data.dataplaneInsight).status"
            resource="Data Plane Proxy"
            :src="`/meshes/${props.data.mesh}/dataplanes/${props.data.name}/data-path/stats`"
            query-key="envoy-data-stats-data-plane"
          />
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'

import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteTitle from '@/app/application/components/route-view/RouteTitle.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import EnvoyData from '@/app/common/EnvoyData.vue'
import type { DataPlaneOverview } from '@/types/index.d'
import { useI18n } from '@/utilities'
import { getStatusAndReason } from '@/utilities/dataplane'

const { t } = useI18n()

const props = defineProps<{
  data: DataPlaneOverview
}>()
</script>
