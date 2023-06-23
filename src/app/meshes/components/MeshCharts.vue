<template>
  <div class="chart-box-list">
    <DoughnutChart :data="servicesChartData" />

    <DoughnutChart :data="dataplanesChartData" />

    <DoughnutChart :data="kumaDPVersionsChartData" />

    <DoughnutChart :data="envoyVersionsChartData" />
  </div>
</template>

<script lang="ts" setup>
import semverCompare from 'semver/functions/compare'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import DoughnutChart from '@/app/common/charts/DoughnutChart.vue'
import { MergedMeshInsights, mergeInsightsReducer } from '@/store/reducers/mesh-insights'
import { useStore } from '@/store/store'
import type { ChartDataPoint, DataPlaneProxyStatus, ServiceStatus } from '@/types/index.d'
import { useI18n, useKumaApi } from '@/utilities'

const i18n = useI18n()
const kumaApi = useKumaApi()
const route = useRoute()
const store = useStore()

const isLoading = ref(false)
const dataPlaneProxyStatus = ref<Required<DataPlaneProxyStatus>>({
  total: 0,
  online: 0,
  partiallyDegraded: 0,
  offline: 0,
})
const serviceStatus = ref<Required<ServiceStatus>>({
  total: 0,
  internal: 0,
  external: 0,
})
const dpVersions = ref<{
  kumaDp: Record<string, DataPlaneProxyStatus>
  envoy: Record<string, DataPlaneProxyStatus>
}>({
  kumaDp: {},
  envoy: {},
})

const servicesChartData = computed(() => {
  const dataPoints: ChartDataPoint[] = []
  const { internal, external } = serviceStatus.value

  if (internal && store.state.selectedMesh !== null) {
    dataPoints.push({
      title: i18n.t('common.charts.services.internalLabel'),
      data: internal,
      route: {
        name: 'services-list-view',
        params: {
          mesh: store.state.selectedMesh,
        },
      },
    })
  }

  if (external && store.state.selectedMesh !== null) {
    dataPoints.push({
      title: i18n.t('common.charts.services.externalLabel'),
      data: external,
      route: {
        name: 'services-list-view',
        params: {
          mesh: store.state.selectedMesh,
        },
      },
    })
  }

  return {
    title: i18n.t('common.charts.services.title'),
    showTotal: true,
    dataPoints,
  }
})

const dataplanesChartData = computed(() => {
  const dataPoints: ChartDataPoint[] = []

  const { total, online, partiallyDegraded } = dataPlaneProxyStatus.value
  if (total > 0) {
    dataPoints.push({
      title: i18n.t('http.api.value.online'),
      statusKeyword: 'online',
      data: online,
    })

    if (partiallyDegraded > 0) {
      dataPoints.push({
        title: i18n.t('http.api.value.partially_degraded'),
        statusKeyword: 'partially_degraded',
        data: partiallyDegraded,
      })
    }

    const offline = total - partiallyDegraded - online
    if (offline > 0) {
      dataPoints.push({
        title: i18n.t('http.api.value.offline'),
        statusKeyword: 'offline',
        data: offline,
      })
    }
  }

  return {
    title: i18n.t('common.charts.dataPlaneProxies.title'),
    showTotal: true,
    dataPoints,
  }
})

const kumaDPVersionsChartData = computed(() => {
  const dataPoints: ChartDataPoint[] = Object.entries(dpVersions.value.kumaDp).map(([version, status]) => ({
    title: version,
    data: status.total ?? 0,
  }))

  dataPoints.sort((dataPointA, dataPointB) => {
    if (dataPointA.title === 'unknown') {
      return 1
    } else if (dataPointB.title === 'unknown') {
      return -1
    }

    return semverCompare(dataPointA.title, dataPointB.title)
  })

  return {
    title: i18n.t('common.charts.kumaDp.title'),
    subtitle: i18n.t('common.charts.kumaDp.subtitle'),
    dataPoints,
  }
})

const envoyVersionsChartData = computed(() => {
  const dataPoints: ChartDataPoint[] = Object.entries(dpVersions.value.envoy).map(([version, status]) => ({
    title: version,
    data: status.total ?? 0,
  }))

  dataPoints.sort((dataPointA, dataPointB) => {
    if (dataPointA.title === 'unknown') {
      return 1
    } else if (dataPointB.title === 'unknown') {
      return -1
    }

    return semverCompare(dataPointA.title, dataPointB.title)
  })

  return {
    title: i18n.t('common.charts.envoy.title'),
    subtitle: i18n.t('common.charts.envoy.subtitle'),
    dataPoints,
  }
})

loadData()

async function loadData() {
  isLoading.value = true

  const name = route.params.mesh as string

  try {
    const originalMeshInsight = await kumaApi.getMeshInsights({ name })
    const meshInsight = mergeInsightsReducer([originalMeshInsight])

    setDataPlaneProxyStatus(meshInsight)
    setServiceStatus(meshInsight)
    setDpVersions(meshInsight)
  } catch {
    dataPlaneProxyStatus.value = {
      total: 0,
      online: 0,
      partiallyDegraded: 0,
      offline: 0,
    }
    serviceStatus.value = {
      total: 0,
      internal: 0,
      external: 0,
    }
    dpVersions.value = {
      kumaDp: {},
      envoy: {},
    }
  } finally {
    isLoading.value = false
  }
}

function setDataPlaneProxyStatus(meshInsight: MergedMeshInsights) {
  const { total, online, partiallyDegraded } = meshInsight.dataplanes

  dataPlaneProxyStatus.value = {
    total,
    online,
    partiallyDegraded,
    offline: total - online - partiallyDegraded,
  }
}

function setServiceStatus(meshInsight: MergedMeshInsights) {
  const { total, internal, external } = meshInsight.services

  serviceStatus.value = {
    total,
    internal,
    external,
  }
}

function setDpVersions(meshInsight: MergedMeshInsights) {
  dpVersions.value = meshInsight.dpVersions
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
