<template>
  <DataSource
    v-slot="{ data: meshInsightsData, isLoading: meshInsightsIsLoading, error: meshInsightsError }: MeshInsightCollectionSource"
    src="/all-mesh-insights"
  >
    <DataSource
      v-slot="{ data: zoneOverviewsData, isLoading: zoneOverviewsIsLoading, error: zoneOverviewsError }: ZoneOverviewCollectionSource"
      src="/all-zone-overviews"
      :should-make-request="store.getters['config/getMulticlusterStatus']"
    >
      <LoadingBlock v-if="meshInsightsIsLoading || zoneOverviewsIsLoading" />

      <ErrorBlock
        v-else-if="meshInsightsError ?? zoneOverviewsError"
        :error="meshInsightsError ?? zoneOverviewsError"
      />

      <ControlPlaneDetails
        v-else
        data-testid="detail-view-details"
        :mesh-insights="meshInsightsData?.items"
        :zone-overviews="zoneOverviewsData?.items"
      />
    </DataSource>
  </DataSource>
</template>

<script lang="ts" setup>
import ControlPlaneDetails from '../components/ControlPlaneDetails.vue'
import type { MeshInsightCollectionSource, ZoneOverviewCollectionSource } from '../sources'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { useStore } from '@/store/store'

const store = useStore()
</script>
