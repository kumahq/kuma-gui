<template>
  <RouteView
    name="zone-cp-detail-view"
    data-testid="zone-cp-detail-view"
  >
    <AppView>
      <ZoneDetails
        :zone-overview="props.data"
        data-testid="detail-view-details"
      />
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import ZoneDetails from '../components/ZoneDetails.vue'
import AppView from '@/app/application/components/app-view/AppView.vue'
import RouteView from '@/app/application/components/route-view/RouteView.vue'
import type { ZoneOverview } from '@/types/index.d'

const props = defineProps<{
  data: ZoneOverview
}>()
</script>
