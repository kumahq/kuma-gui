<template>
  <RouteView
    name="data-plane-detail-view"
  >
    <AppView>
      <DataPlaneDetails
        :dataplane-overview="props.data"
        data-testid="detail-view-details"
      />
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import DataPlaneDetails from '../components/DataPlaneDetails.vue'
import type { DataPlaneOverview } from '@/types/index.d'

const props = defineProps<{
  data: DataPlaneOverview
}>()
</script>
