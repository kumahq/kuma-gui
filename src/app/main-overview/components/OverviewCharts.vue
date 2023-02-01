<template>
  <div class="chart-box-list">
    <DoughnutChart
      v-if="isMultizoneMode"
      class="chart chart-1/2 chart-offset-left-1/6"
      :data="zonesChartData"
    />

    <DoughnutChart
      v-if="isMultizoneMode"
      class="chart chart-1/2 chart-offset-right-1/6"
      :data="zonesCPVersionsChartData"
    />

    <DoughnutChart
      class="chart chart-1/3"
      :data="meshesChartData"
    />

    <DoughnutChart
      class="chart chart-1/3"
      :data="servicesChartData"
    />

    <DoughnutChart
      class="chart chart-1/3"
      :data="dataplanesChartData"
    />

    <DoughnutChart
      class="chart chart-1/2 chart-offset-left-1/6"
      :data="kumaDPVersionsChartData"
    />

    <DoughnutChart
      class="chart chart-1/2 chart-offset-right-1/6"
      :data="envoyVersionsChartData"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import DoughnutChart from '@/app/common/charts/DoughnutChart.vue'
import { useStore } from '@/store/store'

const store = useStore()

const isMultizoneMode = computed(() => store.getters['config/getMulticlusterStatus'])

const servicesChartData = computed(() => store.getters.getChart('services', {
  title: 'Services',
  showTotal: true,
}))
const dataplanesChartData = computed(() => store.getters.getChart('dataplanes', {
  title: 'DP Proxies',
  showTotal: true,
  isStatusChart: true,
}))
const meshesChartData = computed(() => store.getters.getChart('meshes', {
  title: 'Meshes',
  showTotal: true,
}))
const zonesChartData = computed(() => store.getters.getChart('zones', {
  title: 'Zones',
  showTotal: true,
  isStatusChart: true,
}))
const zonesCPVersionsChartData = computed(() => store.getters.getChart('zonesCPVersions', {
  title: 'Zone CP',
  subtitle: 'versions',
}))
const kumaDPVersionsChartData = computed(() => store.getters.getChart('kumaDPVersions', {
  title: 'Kuma DP',
  subtitle: 'versions',
}))
const envoyVersionsChartData = computed(() => store.getters.getChart('envoyVersions', {
  title: 'Envoy',
  subtitle: 'versions',
}))

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
.chart-box-list {
  display: flex;
  flex-wrap: wrap;
}
.chart {
  margin-top: var(--spacing-lg);
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
