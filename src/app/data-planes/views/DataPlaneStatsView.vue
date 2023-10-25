<template>
  <RouteView
    v-slot="{ route, t }"
    name="data-plane-stats-view"
    :params="{
      mesh: '',
      dataPlane: '',
    }"
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
            :src="`/meshes/${route.params.mesh}/dataplanes/${route.params.dataPlane}/data-path/stats`"
            query-key="envoy-data-stats-data-plane"
          />
        </template>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import EnvoyData from '@/app/common/EnvoyData.vue'
import type { DataPlaneOverview } from '@/types/index.d'
import { getStatusAndReason } from '@/utilities/dataplane'

const props = defineProps<{
  data: DataPlaneOverview
}>()
</script>
