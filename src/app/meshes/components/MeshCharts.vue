<template>
  <div class="chart-box-list">
    <DoughnutChart :data="servicesChartData" />

    <DoughnutChart :data="dataplanesChartData" />

    <DoughnutChart :data="kumaDPVersionsChartData" />

    <DoughnutChart :data="envoyVersionsChartData" />
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

import DoughnutChart from '@/app/common/charts/DoughnutChart.vue'
import { useStore } from '@/store/store'

const route = useRoute()
const store = useStore()

const servicesChartData = computed(() => store.getters.getChart('services', {
  title: 'Services',
  showTotal: true,
}))
const dataplanesChartData = computed(() => store.getters.getChart('dataplanes', {
  title: 'DP Proxies',
  showTotal: true,
  isStatusChart: true,
}))
const kumaDPVersionsChartData = computed(() => store.getters.getChart('kumaDPVersions', {
  title: 'Kuma DP',
  subtitle: 'versions',
}))
const envoyVersionsChartData = computed(() => store.getters.getChart('envoyVersions', {
  title: 'Envoy',
  subtitle: 'versions',
}))

watch(() => route.params.mesh, function (newMesh) {
  if (typeof newMesh === 'string') {
    loadData(newMesh)
  }
}, { immediate: true })

function loadData(mesh: string) {
  store.dispatch('fetchMeshInsights', mesh)
  store.dispatch('fetchServices', mesh)
}
</script>

<style lang="scss" scoped>
.chart-box-list {
  display: flex;
  flex-wrap: wrap;
  row-gap: var(--spacing-lg);
}

.chart-box-list > * {
  flex-basis: 25%;
}
</style>
