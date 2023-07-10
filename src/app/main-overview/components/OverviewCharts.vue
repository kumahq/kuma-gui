<template>
  <KCard>
    <template #body>
      <div
        v-if="!isLoading"
        class="chart-box-list"
      >
        <DoughnutChart
          v-if="isMultizoneMode"
          data-testid="zones"
          class="chart chart-1/2 chart-offset-left-1/6"
          :data="zonesChartData"
        />

        <DoughnutChart
          v-if="isMultizoneMode"
          data-testid="zone-versions"
          class="chart chart-1/2 chart-offset-right-1/6"
          :data="zonesCPVersionsChartData"
        />

        <DoughnutChart
          data-testid="meshes"
          class="chart chart-1/3"
          :data="meshesChartData"
        />

        <DoughnutChart
          data-testid="services"
          class="chart chart-1/3"
          :data="servicesChartData"
        />

        <DoughnutChart
          data-testid="data-planes"
          class="chart chart-1/3"
          :data="dataplanesChartData"
        />

        <DoughnutChart
          data-testid="data-plane-versions"
          class="chart chart-1/2 chart-offset-left-1/6"
          :data="kumaDPVersionsChartData"
        />

        <DoughnutChart
          data-testid="envoy-versions"
          class="chart chart-1/2 chart-offset-right-1/6"
          :data="envoyVersionsChartData"
        />
      </div>
      <LoadingBlock v-else />
    </template>
  </KCard>
</template>

<script lang="ts" setup>
import { KCard } from '@kong/kongponents'
import semverCompare from 'semver/functions/compare'
import { computed, ref } from 'vue'

import DoughnutChart from '@/app/common/charts/DoughnutChart.vue'
import LoadingBlock from '@/app/common/LoadingBlock.vue'
import { MergedMeshInsights, mergeInsightsReducer } from '@/store/reducers/mesh-insights'
import { useStore } from '@/store/store'
import type {
  ChartDataPoint,
  DataPlaneProxyStatus,
  DoughnutChartData,
  GlobalInsights,
  KDSSubscription,
  ResourceStat,
  ServiceStatus,
  ZoneOverview,
} from '@/types/index.d'
import { useI18n, useKumaApi } from '@/utilities'
import { getItemStatusFromInsight } from '@/utilities/dataplane'
import { fetchAllResources } from '@/utilities/helpers'

const i18n = useI18n()
const kumaApi = useKumaApi()
const store = useStore()

const isLoading = ref(false)
const zoneOverviews = ref<ZoneOverview[]>([])
const meshStatus = ref<ResourceStat>({ total: 0 })
const zoneStatus = ref<{ total: number, online: number, offline: number }>({
  total: 0,
  online: 0,
  offline: 0,
})
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

const isMultizoneMode = computed(() => store.getters['config/getMulticlusterStatus'])

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
const meshesChartData = computed(() => {
  const dataPoints: ChartDataPoint[] = []

  if (meshStatus.value.total) {
    dataPoints.push({
      title: i18n.t('common.charts.meshes.meshLabel'),
      data: meshStatus.value.total,
    })
  }

  return {
    title: i18n.t('common.charts.meshes.title'),
    showTotal: true,
    dataPoints,
  }
})
const zonesChartData = computed<DoughnutChartData>(() => {
  const dataPoints: ChartDataPoint[] = []

  const { total, online } = zoneStatus.value
  if (total) {
    dataPoints.push({
      title: i18n.t('http.api.value.online'),
      statusKeyword: 'online',
      data: online,
      route: {
        name: 'zone-cp-list-view',
      },
    })

    if (online !== total) {
      dataPoints.push({
        title: i18n.t('http.api.value.offline'),
        statusKeyword: 'offline',
        data: total - online,
        route: {
          name: 'zone-cp-list-view',
        },
      })
    }
  }

  return {
    title: i18n.t('common.charts.zones.title'),
    showTotal: true,
    dataPoints,
  }
})
const zonesCPVersionsChartData = computed(() => {
  const dataPoints: ChartDataPoint[] = zoneOverviews.value.reduce((dataPoints: ChartDataPoint[], zoneOverview) => {
    const subscriptions = zoneOverview.zoneInsight?.subscriptions ?? []

    if (subscriptions.length === 0) {
      return dataPoints
    }

    const lastSubscription = subscriptions.pop() as KDSSubscription

    const existingDataPoint = dataPoints.find((dataPoint) => dataPoint.title === lastSubscription.version?.kumaCp?.version)

    if (!existingDataPoint) {
      dataPoints.push({
        title: lastSubscription.version.kumaCp.version,
        data: 1,
        route: {
          name: 'zone-cp-list-view',
        },
      })
    } else {
      existingDataPoint.data++
    }

    return dataPoints
  }, [])

  dataPoints.sort((dataPointA, dataPointB) => {
    if (dataPointA.title === 'unknown') {
      return 1
    } else if (dataPointB.title === 'unknown') {
      return -1
    }

    return semverCompare(dataPointA.title, dataPointB.title)
  })

  return {
    title: i18n.t('common.charts.zoneCps.title'),
    subtitle: i18n.t('common.charts.zoneCps.subtitle'),
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

  try {
    const [
      globalInsightsResult,
      zoneOverviewsResult,
      meshInsightsResult,
    ] = await Promise.allSettled([
      kumaApi.getGlobalInsights(),
      fetchAllResources(kumaApi.getAllZoneOverviews.bind(kumaApi)),
      fetchAllResources(kumaApi.getAllMeshInsights.bind(kumaApi)),
    ])

    if (globalInsightsResult.status === 'fulfilled') {
      setMeshStatus(globalInsightsResult.value)
    }

    zoneOverviews.value = zoneOverviewsResult.status === 'fulfilled' ? zoneOverviewsResult.value.items : []
    if (globalInsightsResult.status === 'fulfilled') {
      setZoneStatus(zoneOverviews.value, globalInsightsResult.value)
    }

    if (meshInsightsResult.status === 'fulfilled') {
      const meshInsight = mergeInsightsReducer(meshInsightsResult.value.items)
      setDataPlaneProxyStatus(meshInsight)
      setServiceStatus(meshInsight)
      setDpVersions(meshInsight)
    }
  } catch {
    zoneStatus.value = {
      total: 0,
      online: 0,
      offline: 0,
    }
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

function setMeshStatus(globalInsights: GlobalInsights) {
  meshStatus.value.total = globalInsights.resources.Mesh?.total ?? 0
}

function setZoneStatus(zoneOverviews: ZoneOverview[], globalInsights: GlobalInsights) {
  if (zoneOverviews.length > 0) {
    zoneStatus.value.total = zoneOverviews.length
    zoneStatus.value.online = zoneOverviews.reduce((online, zoneOverview) => {
      const status = getItemStatusFromInsight(zoneOverview.zoneInsight)

      if (status === 'online') {
        online++
      }

      return online
    }, 0)
    zoneStatus.value.offline = zoneStatus.value.total - zoneStatus.value.online
  } else {
    // Falling back to some basic stats from global insights. If nothing else is available, yet, we at least can show *some* of the charts with correct counts.
    zoneStatus.value.total = globalInsights.resources.Zone?.total ?? 0
    zoneStatus.value.online = zoneStatus.value.total
    zoneStatus.value.offline = 0
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
