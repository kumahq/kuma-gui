<template>
  <div class="chart-container mt-16">
    <DonutChart
      class="chart chart-1/4"
      :title="{ singular: 'SERVICE', plural: 'SERVICES' }"
      :data="servicesChart.data"
      :is-loading="isLoadingServices"
      save-chart
    />

    <DonutChart
      class="chart chart-1/4"
      :title="{ singular: 'DP PROXY', plural: 'DP PROXIES' }"
      :data="dataplanesChart.data"
      :url="{ name: 'data-plane-list-view', params: { mesh: store.state.selectedMesh } }"
      :is-loading="isLoadingMeshInsights"
    />

    <DonutChart
      class="chart chart-1/4"
      :title="{ singular: 'POLICY', plural: 'POLICIES' }"
      :data="policiesChart.data"
      :url="{ name: 'policies', params: { mesh: store.state.selectedMesh } }"
      :is-loading="isLoadingMeshInsights"
    />

    <VersionsDonutChart
      class="chart chart-1/4"
      title="KUMA DP"
      :data="kumaDPVersionsChart.data"
      :is-loading="isLoadingMeshInsights"
    />

    <VersionsDonutChart
      class="chart chart-1/4"
      title="ENVOY"
      :data="envoyVersionsChart.data"
      :is-loading="isLoadingMeshInsights"
      display-am-charts-logo
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'

import { useStore } from '@/store/store'
import DonutChart from '@/app/common/charts/DonutChart.vue'
import VersionsDonutChart from '@/app/common/charts/VersionsDonutChart.vue'

const store = useStore()

const isLoadingServices = computed(() => store.getters.getServiceResourcesFetching)
const isLoadingMeshInsights = computed(() => store.getters.getMeshInsightsFetching)
const servicesChart = computed(() => store.getters.getChart('services'))
const dataplanesChart = computed(() => store.getters.getChart('dataplanes'))
const policiesChart = computed(() => store.getters.getChart('policies'))
const kumaDPVersionsChart = computed(() => store.getters.getChart('kumaDPVersions'))
const envoyVersionsChart = computed(() => store.getters.getChart('envoyVersions'))

watch(() => store.state.selectedMesh, function () {
  loadData()
})

loadData()

function loadData() {
  store.dispatch('fetchMeshInsights', store.state.selectedMesh)
  store.dispatch('fetchServices', store.state.selectedMesh)
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

.chart-1\/4 {
  flex-basis: 20%;
}
</style>

<style lang="scss">
.pie-chart-label {
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
</style>
