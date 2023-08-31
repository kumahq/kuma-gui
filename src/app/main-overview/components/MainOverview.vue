<template>
  <DataSource
    v-slot="{ data: meshInsightsData, isLoading: meshInsightsIsLoading, error: meshInsightsError }: MeshInsightCollectionSource"
    src="/all-mesh-insights"
  >
    <DataSource
      v-slot="{ data: zoneOverviewsData, isLoading: zoneOverviewsIsLoading, error: zoneOverviewsError }: ZoneOverviewCollectionSource"
      :src="can('use zones') ? '/all-zone-overviews' : ''"
    >
      <LoadingBlock v-if="meshInsightsIsLoading || zoneOverviewsIsLoading" />

      <ErrorBlock
        v-else-if="meshInsightsError"
        :error="meshInsightsError"
      />

      <ErrorBlock
        v-else-if="zoneOverviewsError"
        :error="zoneOverviewsError"
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
import { useCan } from '@/app/application'
import DataSource from '@/app/application/components/data-source/DataSource.vue'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'

const can = useCan()
</script>
