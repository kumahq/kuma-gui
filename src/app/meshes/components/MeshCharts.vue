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
import { PropType, computed } from 'vue'

import DoughnutChart from '@/app/common/charts/DoughnutChart.vue'
import { mergeInsightsReducer } from '@/store/reducers/mesh-insights'
import type { ChartDataPoint, MeshInsight } from '@/types/index.d'
import { useI18n } from '@/utilities'

const i18n = useI18n()

const props = defineProps({
  meshInsight: {
    type: Object as PropType<MeshInsight>,
    required: true,
  },
})

const processedMeshInsight = computed(() => mergeInsightsReducer([props.meshInsight]))

const dataPlaneProxyStatus = computed(() => {
  const { total, online, partiallyDegraded } = processedMeshInsight.value.dataplanes

  return {
    total,
    online,
    partiallyDegraded,
    offline: total - online - partiallyDegraded,
  }
})

const serviceStatus = computed(() => {
  const { total, internal, external } = processedMeshInsight.value.services

  return {
    total,
    internal,
    external,
  }
})

const dpVersions = computed(() => {
  return processedMeshInsight.value.dpVersions
})

const servicesChartData = computed(() => {
  const dataPoints: ChartDataPoint[] = []
  const { internal, external } = serviceStatus.value

  if (internal) {
    dataPoints.push({
      title: i18n.t('common.charts.services.internalLabel'),
      data: internal,
    })
  }

  if (external) {
    dataPoints.push({
      title: i18n.t('common.charts.services.externalLabel'),
      data: external,
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
