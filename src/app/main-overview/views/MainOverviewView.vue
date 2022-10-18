<template>
  <div class="chart-container mt-16">
    <DonutChart
      v-if="isMultizoneMode"
      class="chart chart-1/2 chart-offset-left-1/6"
      :title="{ singular: 'Zone', plural: 'Zones' }"
      :data="zonesChart.data"
      :url="{ name: 'zones' }"
      :is-loading="isLoadingZonesInsights"
    />

    <VersionsDonutChart
      v-if="isMultizoneMode"
      class="chart chart-1/2 chart-offset-right-1/6"
      title="ZONE CP"
      :data="zonesCPVersionsChart.data"
      :url="{ name: 'zones' }"
      :is-loading="isLoadingZonesInsights"
    />

    <DonutChart
      class="chart chart-1/3"
      :title="{ singular: 'Mesh', plural: 'Meshes' }"
      :data="meshesChart.data"
      :is-loading="isLoadingMeshInsights"
    />

    <DonutChart
      class="chart chart-1/3"
      :title="{ singular: 'Service', plural: 'Services' }"
      :data="servicesChart.data"
      :is-loading="isLoadingServices"
      save-chart
    />

    <DonutChart
      class="chart chart-1/3"
      :title="{ singular: 'DP Proxy', plural: 'DP Proxies' }"
      :data="dataplanesChart.data"
      :is-loading="isLoadingMeshInsights"
    />

    <VersionsDonutChart
      class="chart chart-1/2 chart-offset-left-1/6"
      title="KUMA DP"
      :data="kumaDPVersionsChart.data"
      :is-loading="isLoadingMeshInsights"
    />

    <VersionsDonutChart
      class="chart chart-1/2 chart-offset-right-1/6"
      title="ENVOY"
      :data="envoyVersionsChart.data"
      :is-loading="isLoadingMeshInsights"
      display-am-charts-logo
    />
  </div>

  <MeshResources class="mt-8" />
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'

import DonutChart from '@/components/DonutChart.vue'
import VersionsDonutChart from '@/components/VersionsDonutChart.vue'
import MeshResources from '@/app/common/MeshResources.vue'
import { useStore } from '@/store/store'

const store = useStore()

const isMultizoneMode = computed(() => store.getters['config/getMulticlusterStatus'])
const isLoadingServices = computed(() => store.getters.getServiceResourcesFetching)
const isLoadingZonesInsights = computed(() => store.getters.getZonesInsightsFetching)
const isLoadingMeshInsights = computed(() => store.getters.getMeshInsightsFetching)
const servicesChart = computed(() => store.getters.getChart('services'))
const dataplanesChart = computed(() => store.getters.getChart('dataplanes'))
const meshesChart = computed(() => store.getters.getChart('meshes'))
const zonesChart = computed(() => store.getters.getChart('zones'))
const zonesCPVersionsChart = computed(() => store.getters.getChart('zonesCPVersions'))
const kumaDPVersionsChart = computed(() => store.getters.getChart('kumaDPVersions'))
const envoyVersionsChart = computed(() => store.getters.getChart('envoyVersions'))

watch(() => isMultizoneMode.value, function () {
  loadData()
})

loadData()

function loadData() {
  store.dispatch('fetchMeshInsights')
  store.dispatch('fetchServices')
  store.dispatch('fetchZonesInsights', isMultizoneMode.value)

  if (isMultizoneMode.value) {
    store.dispatch('fetchTotalClusterCount')
  }
}
</script>

<style lang="scss" scoped>
.chart-container {
  display: flex;
  flex-wrap: wrap;
}

.chart {
  margin-top: var(--spacing-lg);
  height: 200px;
}

.chart-1\/2 {
  flex-basis: 50%;
}

.chart-offset-left-1\/6 {
  padding-left: 16.666%;
}

.chart-offset-right-1\/6 {
  padding-right: 16.666%;
}

.chart-1\/3 {
  flex-basis: 33.333%;
}
</style>

<style lang="scss">
.pie-chart-label {
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
</style>
