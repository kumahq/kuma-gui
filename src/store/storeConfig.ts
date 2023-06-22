import semverCompare from 'semver/functions/compare'
import { StoreOptions } from 'vuex'

import { ConfigInterface } from './modules/config/config.types'
import { NotificationsInterface } from './modules/notifications/notifications.types'
import { OnboardingInterface } from './modules/onboarding/onboarding.types'
import { SidebarInterface } from './modules/sidebar/sidebar.types'
import { PAGE_REQUEST_SIZE_DEFAULT } from '@/constants'
import type KumaApi from '@/services/kuma-api/KumaApi'
import config from '@/store/modules/config/config'
import notifications from '@/store/modules/notifications/notifications'
import onboarding from '@/store/modules/onboarding/onboarding'
import sidebar from '@/store/modules/sidebar/sidebar'
import { getEmptyInsight, mergeInsightsReducer, parseInsightReducer } from '@/store/reducers/mesh-insights'
import {
  ChartDataPoint,
  DoughnutChartData,
  KDSSubscription,
  Mesh,
  PolicyType,
  ServiceInsight,
  StatusKeyword,
  ZoneOverview,
} from '@/types/index.d'
import { ClientStorage } from '@/utilities/ClientStorage'
import { getItemStatusFromInsight } from '@/utilities/dataplane'
import { fetchAllResources } from '@/utilities/helpers'

const ONLINE = 'Online'
const OFFLINE = 'Offline'
const PARTIALLY_DEGRADED = 'Partially degraded'

/**
 * The root state of the application’s Vuex store minus all module state.
 */
interface BareRootState {
  menu: null
  globalLoading: boolean
  /**
   * Controls whether related pieces in the UI *may* be shown.
   *
   */
  defaultVisibility: {
    appError: boolean
    notificationManager: boolean
    onboardingNotification: boolean
  }
  meshes: {
    items: Mesh[]
    total: number
    next: string | null
  }
  selectedMesh: string | null
  totalDataplaneCount: number
  version: string
  itemQueryNamespace: string
  totalClusters: number
  serviceSummary: {
    total: number
    internal: {
      total: number
      online: number
      offline: number
      partiallyDegraded: number
    }
    external: {
      total: number
    }
  }
  overviewCharts: Record<string, { data: ChartDataPoint[] }>
  meshInsight: {
    meshesTotal: number
    dataplanes: {
      online: number
      partiallyDegraded: number
      total: number
    }
    policies: Record<string, { total: number }>
    dpVersions: {
      kumaDp: Record<string, { total: number, online: number }>
      envoy: Record<string, { total: number, online: number }>
    }
  }
  meshInsightsFetching: boolean
  serviceInsightsFetching: boolean
  externalServicesFetching: boolean
  zonesInsightsFetching: boolean
  policyTypes: PolicyType[]
  policyTypesByPath: Record<string, PolicyType | undefined>
  policyTypesByName: Record<string, PolicyType | undefined>
  globalKdsAddress: string
}

const initialState: BareRootState = {
  menu: null,
  globalLoading: true,
  defaultVisibility: {
    appError: true,
    notificationManager: true,
    onboardingNotification: true,
  },
  meshes: {
    total: 0,
    items: [],
    next: null,
  },
  selectedMesh: 'default',
  totalDataplaneCount: 0,
  version: '',
  itemQueryNamespace: 'item',
  totalClusters: 0,
  serviceSummary: {
    total: 0,
    internal: {
      total: 0,
      online: 0,
      offline: 0,
      partiallyDegraded: 0,
    },
    external: {
      total: 0,
    },
  },
  overviewCharts: {
    dataplanes: {
      data: [],
    },
    meshes: {
      data: [],
    },
    services: {
      data: [],
    },
    policies: {
      data: [],
    },
    zones: {
      data: [],
    },
    zonesCPVersions: {
      data: [],
    },
    kumaDPVersions: {
      data: [],
    },
    envoyVersions: {
      data: [],
    },
  },
  meshInsight: getEmptyInsight(),
  meshInsightsFetching: false,
  serviceInsightsFetching: false,
  externalServicesFetching: false,
  zonesInsightsFetching: false,
  policyTypes: [],
  policyTypesByPath: {},
  policyTypesByName: {},
  globalKdsAddress: 'grpcs://<global-kds-address>:5685',
}

/**
 * The root state of the application’s Vuex store including all module state.
 *
 * Module state is explicitly added because creating a store using modules needs it. By default, Vuex’s types for stores with namespaced modules will be incorrect.
 */
export interface State extends BareRootState {
  config: ConfigInterface
  sidebar: SidebarInterface
  notifications: NotificationsInterface
  onboarding: OnboardingInterface
}

export const storeConfig = (kumaApi: KumaApi): StoreOptions<State> => {
  return {
    modules: {
      sidebar: sidebar(kumaApi),
      config: config(kumaApi),
      notifications,
      onboarding,
    },

    // Explicitly asserts `initialState` to be of type `State` (which includes module state) even though `initialSate` doesn’t include module state. This is necessary because otherwise the result of creating a store from `storeConfig` and `State` will be a store (i.e. `Store<State>`) that, according to its type, is missing all module state which it actually doesn’t. Vuex’s types aren’t complete and don’t account for this scenario. Without this workaround, accessing module state without a type guard would always produce a TypeScript error.
    state: () => initialState as State,

    getters: {
      globalLoading: state => state.globalLoading,

      shouldShowAppError: (state) => {
        return state.defaultVisibility.appError && state.config.status !== 'OK'
      },
      shouldShowNotificationManager: (state, getters) => {
        return state.defaultVisibility.notificationManager && getters['notifications/amountOfActions'] > 0
      },
      shouldShowOnboardingNotification: (state) => {
        const hasOnlyDefaultMesh = state.meshes.items.length === 1 && state.meshes.items[0].name === 'default'

        return state.defaultVisibility.onboardingNotification && state.totalDataplaneCount === 0 && hasOnlyDefaultMesh
      },

      getMeshList: state => state.meshes,
      getItemQueryNamespace: state => state.itemQueryNamespace,
      getMeshInsight: state => state.meshInsight,
      getMeshInsightsFetching: state => state.meshInsightsFetching,
      getServiceInsightsFetching: state => state.serviceInsightsFetching,
      getExternalServicesFetching: state => state.externalServicesFetching,
      getResourceFetching: ({ meshInsightsFetching, serviceInsightsFetching, externalServicesFetching }) =>
        meshInsightsFetching || serviceInsightsFetching || externalServicesFetching,
      getServiceResourcesFetching: ({ serviceInsightsFetching, externalServicesFetching }) =>
        serviceInsightsFetching || externalServicesFetching,
      getZonesInsightsFetching: ({ zonesInsightsFetching }) => zonesInsightsFetching,
      getChart: (state) => {
        return (chartName: string, { title, subtitle = undefined, showTotal = false, isStatusChart = false }: DoughnutChartData) => {
          return {
            title,
            subtitle,
            showTotal,
            isStatusChart,
            dataPoints: state.overviewCharts[chartName].data,
          }
        }
      },
    },

    mutations: {
      SET_GLOBAL_LOADING: (state, globalLoading: typeof state.globalLoading) => (state.globalLoading = globalLoading),
      SET_MESHES: (state, meshes: typeof state.meshes) => (state.meshes = meshes),
      SET_SELECTED_MESH: (state, mesh: typeof state.selectedMesh) => (state.selectedMesh = mesh),
      SET_TOTAL_DATAPLANE_COUNT: (state, totalDataplaneCount: typeof state.totalDataplaneCount) => (state.totalDataplaneCount = totalDataplaneCount),
      SET_TOTAL_CLUSTER_COUNT: (state, totalClusters: typeof state.totalClusters) => (state.totalClusters = totalClusters),
      SET_INTERNAL_SERVICE_SUMMARY: (state, { items = [] }: { items: ServiceInsight[] }) => {
        const initialItemsState: Record<StatusKeyword, number> = {
          online: 0,
          partially_degraded: 0,
          offline: 0,
          not_available: 0,
        }

        const { online, offline, partially_degraded: partiallyDegraded } = items.reduce((acc, { status = 'offline' }) => ({
          ...acc,
          [status]: acc[status] + 1,
        }), initialItemsState)

        const total = online + offline + partiallyDegraded

        state.serviceSummary.internal = {
          ...state.serviceSummary.internal,
          total,
          online,
          partiallyDegraded,
          offline,
        }

        state.serviceSummary.total = state.serviceSummary.external.total + total
      },
      SET_EXTERNAL_SERVICE_SUMMARY: (state, { total = 0 }: { total: number }) => {
        state.serviceSummary.external.total = total
        state.serviceSummary.total = state.serviceSummary.internal.total + total
      },
      SET_MESH_INSIGHT: (state, value) => (state.meshInsight = parseInsightReducer(value)),
      SET_MESH_INSIGHT_FROM_ALL_MESHES: (state, value) => (state.meshInsight = mergeInsightsReducer(value.items)),
      SET_ZONES_INSIGHTS_FETCHING: (state, zonesInsightsFetching: typeof state.zonesInsightsFetching) => (state.zonesInsightsFetching = zonesInsightsFetching),
      SET_MESH_INSIGHTS_FETCHING: (state, meshInsightsFetching: typeof state.meshInsightsFetching) => (state.meshInsightsFetching = meshInsightsFetching),
      SET_SERVICE_INSIGHTS_FETCHING: (state, serviceInsightsFetching: typeof state.serviceInsightsFetching) => (state.serviceInsightsFetching = serviceInsightsFetching),
      SET_EXTERNAL_SERVICES_FETCHING: (state, externalServicesFetching: typeof state.externalServicesFetching) => (state.externalServicesFetching = externalServicesFetching),
      SET_OVERVIEW_CHART_DATA: (state, { chartName, data }: { chartName: string, data: ChartDataPoint[] }) => {
        state.overviewCharts[chartName].data = data
      },
      SET_POLICY_TYPES: (state, policyTypes: typeof state.policyTypes) => {
        policyTypes.sort((policyTypeA, policyTypeB) => policyTypeA.name.localeCompare(policyTypeB.name))

        state.policyTypes = policyTypes
      },
      SET_POLICY_TYPES_BY_PATH: (state, policyTypesByPath: typeof state.policyTypesByPath) => (state.policyTypesByPath = policyTypesByPath),
      SET_POLICY_TYPES_BY_NAME: (state, policyTypesByName: typeof state.policyTypesByName) => (state.policyTypesByName = policyTypesByName),
      SET_GLOBAL_KDS_ADDRESS: (state, globalKdsAddress: typeof state.globalKdsAddress) => (state.globalKdsAddress = globalKdsAddress),
    },

    actions: {
      updateGlobalLoading({ commit }, isLoading: boolean) {
        commit('SET_GLOBAL_LOADING', isLoading)
      },

      async bootstrap({ dispatch, getters, state }) {
        // check the Kuma status before we do anything else
        await dispatch('config/getStatus')

        // only dispatch these actions if the Kuma is online
        if (getters['config/getStatus'] === 'OK') {
          await Promise.all([
            dispatch('fetchMeshList'),
            dispatch('fetchDataplaneTotalCount'),
            dispatch('config/bootstrapConfig'),
          ])

          // Validates if stored mesh exists and fetches the relevant sidebar data.
          if (state.meshes.items.length > 0) {
            const newStoredMesh = ClientStorage.get('selectedMesh')
            let mesh: Mesh | undefined

            // If a selected mesh is stored, check if it actually exists and use it only if it does.
            if (newStoredMesh !== null) {
              const existingMesh = state.meshes.items.find((mesh) => mesh.name === newStoredMesh)

              if (existingMesh !== undefined) {
                mesh = existingMesh
              }
            }

            if (mesh === undefined) {
              // If the stored mesh doesn’t exist, use the first mesh instead.
              mesh = state.meshes.items[0]
            }

            await dispatch('updateSelectedMesh', mesh.name)
            await dispatch('sidebar/getInsights')
          } else {
            await dispatch('updateSelectedMesh', null)
          }
        }
      },

      async fetchMeshList({ commit, state }) {
        const params = {
          size: PAGE_REQUEST_SIZE_DEFAULT,
        }

        try {
          const { total, items, next } = await kumaApi.getAllMeshes(params)
          const meshes: typeof state.meshes = { items: items ?? [], total, next }

          meshes.items.sort((meshA, meshB) => {
            // Prioritizes the mesh named “default”.
            if (meshA.name === 'default') {
              return -1
            } else if (meshB.name === 'default') {
              return 1
            }

            return meshA.name.localeCompare(meshB.name)
          })

          commit('SET_MESHES', meshes)
        } catch (error) {
          console.error(error)
        }
      },

      updateSelectedMesh({ commit }, mesh: string | null) {
        if (mesh !== null) {
          ClientStorage.set('selectedMesh', mesh)
        } else {
          ClientStorage.remove('selectedMesh')
        }

        commit('SET_SELECTED_MESH', mesh)
      },

      async fetchTotalClusterCount({ commit }) {
        const response = await kumaApi.getZones()

        commit('SET_TOTAL_CLUSTER_COUNT', response.total)
      },

      async fetchDataplaneTotalCount({ commit }) {
        try {
          const response = await kumaApi.getAllDataplanes({ size: 1 })

          commit('SET_TOTAL_DATAPLANE_COUNT', response.total)
        } catch (error) {
          console.error(error)
        }
      },

      async fetchGlobalInsights({ commit }) {
        try {
          const globalInsights = await kumaApi.getGlobalInsights()

          const meshesDataPoints: ChartDataPoint[] = [
            {
              title: 'Mesh',
              data: globalInsights.resources.Mesh?.total ?? 0,
            },
          ]
          commit('SET_OVERVIEW_CHART_DATA', { chartName: 'meshes', data: meshesDataPoints })

          const zonesDataPoints: ChartDataPoint[] = [
            {
              title: ONLINE,
              data: globalInsights.resources.Zone?.total ?? 0,
              route: {
                name: 'zone-cp-list-view',
              },
            },
          ]
          commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zones', data: zonesDataPoints })
        } catch (err) {
          console.error(err)
        }
      },

      async fetchMeshInsights({ commit, dispatch }, mesh: string | undefined) {
        commit('SET_MESH_INSIGHTS_FETCHING', true)

        try {
          if (mesh === undefined) {
            const response = await fetchAllResources(kumaApi.getAllMeshInsights.bind(kumaApi))

            if (response.items.length > 0) {
              const data: ChartDataPoint[] = []

              data.push({
                title: 'Mesh',
                data: response.items.length,
              })

              commit('SET_OVERVIEW_CHART_DATA', { chartName: 'meshes', data })
              commit('SET_MESH_INSIGHT_FROM_ALL_MESHES', response)
            }
          } else {
            commit('SET_MESH_INSIGHT', await kumaApi.getMeshInsights({ name: mesh }))
          }
        } catch {
          commit('SET_OVERVIEW_CHART_DATA', { chartName: 'meshes', data: [] })
          commit('SET_MESH_INSIGHT', getEmptyInsight())
        } finally {
          dispatch('setChartsFromMeshInsights')
        }

        commit('SET_MESH_INSIGHTS_FETCHING', false)
      },

      async fetchServiceInsights({ commit }, mesh: string | undefined) {
        commit('SET_SERVICE_INSIGHTS_FETCHING', true)

        try {
          const endpoint = mesh === undefined
            ? kumaApi.getAllServiceInsights.bind(kumaApi)
            : kumaApi.getAllServiceInsightsFromMesh.bind(kumaApi, { mesh })

          commit('SET_INTERNAL_SERVICE_SUMMARY', await fetchAllResources(endpoint))
        } catch {
          commit('SET_INTERNAL_SERVICE_SUMMARY', {})
        }

        commit('SET_SERVICE_INSIGHTS_FETCHING', false)
      },

      async fetchExternalServices({ commit }, mesh: string | undefined) {
        commit('SET_EXTERNAL_SERVICES_FETCHING', true)

        try {
          const endpoint = mesh === undefined
            ? kumaApi.getAllExternalServices.bind(kumaApi)
            : kumaApi.getAllExternalServicesFromMesh.bind(kumaApi, { mesh })

          commit('SET_EXTERNAL_SERVICE_SUMMARY', await fetchAllResources(endpoint))
        } catch {
          commit('SET_EXTERNAL_SERVICE_SUMMARY', {})
        }

        commit('SET_EXTERNAL_SERVICES_FETCHING', false)
      },

      async fetchServices({ dispatch }, mesh: string | undefined) {
        const externalServices = dispatch('fetchExternalServices', mesh)
        const serviceInsights = dispatch('fetchServiceInsights', mesh)

        await Promise.all([serviceInsights, externalServices])
        await dispatch('setOverviewServicesChartData')
      },

      async fetchZonesInsights({ commit, dispatch, getters }, multicluster = false) {
        commit('SET_ZONES_INSIGHTS_FETCHING', true)

        try {
          if (multicluster) {
            const data = await fetchAllResources(kumaApi.getAllZoneOverviews.bind(kumaApi))

            if (data.items.length > 0) {
              dispatch('setOverviewZonesChartData', data)
              dispatch('setOverviewZonesCPVersionsChartData', data)
            }
          } else {
            const zonesData: ChartDataPoint[] = [
              {
                title: 'Zone',
                data: 1,
                route: {
                  name: 'zone-cp-list-view',
                },
              },
            ]

            const versionsData: ChartDataPoint[] = [
              {
                title: getters['config/getVersion'],
                data: 1,
                route: {
                  name: 'zone-cp-list-view',
                },
              },
            ]

            commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zones', data: zonesData })
            commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zonesCPVersions', data: versionsData })
          }
        } catch {
          commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zones', data: [] })
          commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zonesCPVersions', data: [] })
        }

        commit('SET_ZONES_INSIGHTS_FETCHING', false)
      },

      async fetchPolicyTypes({ commit }) {
        const { policies: policyTypes } = await kumaApi.getPolicyTypes()
        const policyTypesByPath = policyTypes.reduce((obj, policyType) => Object.assign(obj, { [policyType.path]: policyType }), {})
        const policyTypesByName = policyTypes.reduce((obj, policyType) => Object.assign(obj, { [policyType.name]: policyType }), {})

        commit('SET_POLICY_TYPES', policyTypes)
        commit('SET_POLICY_TYPES_BY_PATH', policyTypesByPath)
        commit('SET_POLICY_TYPES_BY_NAME', policyTypesByName)
      },

      setChartsFromMeshInsights({ dispatch }) {
        dispatch('setOverviewDataplanesChartData')
        dispatch('setOverviewKumaDPVersionsChartData')
        dispatch('setOverviewEnvoyVersionsChartData')
      },

      setOverviewZonesChartData({ commit }, { items = [] }) {
        const total = items.length

        let online = 0

        items.forEach((item: any): void => {
          const status = getItemStatusFromInsight(item.zoneInsight)

          if (status === 'online') {
            online++
          }
        })

        const chartData: ChartDataPoint[] = []

        if (total) {
          chartData.push({
            title: ONLINE,
            data: online,
            route: {
              name: 'zone-cp-list-view',
            },
          })

          if (online !== total) {
            chartData.push({
              title: OFFLINE,
              data: total - online,
              route: {
                name: 'zone-cp-list-view',
              },
            })
          }
        }

        commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zones', data: chartData })
      },

      setOverviewServicesChartData({ state, commit }) {
        const { internal, external } = state.serviceSummary

        const data: ChartDataPoint[] = []

        if (internal.total && state.selectedMesh !== null) {
          data.push({
            title: 'Internal',
            data: internal.total,
            route: {
              name: 'services-list-view',
              params: {
                mesh: state.selectedMesh,
              },
            },
          })
        }

        if (external.total && state.selectedMesh !== null) {
          data.push({
            title: 'External',
            data: external.total,
            route: {
              name: 'services-list-view',
              params: {
                mesh: state.selectedMesh,
              },
            },
          })
        }

        commit('SET_OVERVIEW_CHART_DATA', { chartName: 'services', data })
      },

      setOverviewDataplanesChartData({ state, commit }) {
        const total = state.meshInsight.dataplanes.total
        const data: ChartDataPoint[] = []

        if (total > 0) {
          const online = state.meshInsight.dataplanes.online ?? 0
          data.push({
            title: ONLINE,
            data: online,
          })

          const partiallyDegraded = state.meshInsight.dataplanes.partiallyDegraded ?? 0
          if (partiallyDegraded > 0) {
            data.push({
              title: PARTIALLY_DEGRADED,
              data: partiallyDegraded,
            })
          }

          const offline = total - partiallyDegraded - online
          if (offline > 0) {
            data.push({
              title: OFFLINE,
              data: offline,
            })
          }
        }

        commit('SET_OVERVIEW_CHART_DATA', { chartName: 'dataplanes', data })
      },

      setOverviewZonesCPVersionsChartData({ commit }, { items }: { items: ZoneOverview[] }) {
        const data: ChartDataPoint[] = items.reduce((dataPoints: ChartDataPoint[], curr) => {
          const subscriptions = curr.zoneInsight?.subscriptions ?? []

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

        data.sort((dataPointA, dataPointB) => {
          if (dataPointA.title === 'unknown') {
            return 1
          } else if (dataPointB.title === 'unknown') {
            return -1
          }

          return semverCompare(dataPointA.title, dataPointB.title)
        })

        commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zonesCPVersions', data })
      },

      setOverviewEnvoyVersionsChartData({ state, commit }) {
        const { envoy } = state.meshInsight.dpVersions

        const data: ChartDataPoint[] = Object.entries(envoy).map(([version, stats]) => ({
          title: version,
          data: stats.total,
        }))

        data.sort((dataPointA, dataPointB) => {
          if (dataPointA.title === 'unknown') {
            return 1
          } else if (dataPointB.title === 'unknown') {
            return -1
          }

          return semverCompare(dataPointA.title, dataPointB.title)
        })

        commit('SET_OVERVIEW_CHART_DATA', { chartName: 'envoyVersions', data })
      },

      setOverviewKumaDPVersionsChartData({ state, commit }) {
        const { kumaDp } = state.meshInsight.dpVersions

        const data: ChartDataPoint[] = Object.entries(kumaDp).map(([version, stats]) => ({
          title: version,
          data: stats.total,
        }))

        data.sort((dataPointA, dataPointB) => {
          if (dataPointA.title === 'unknown') {
            return 1
          } else if (dataPointB.title === 'unknown') {
            return -1
          }

          return semverCompare(dataPointA.title, dataPointB.title)
        })

        commit('SET_OVERVIEW_CHART_DATA', { chartName: 'kumaDPVersions', data })
      },

      updateGlobalKdsAddress({ commit }, globalKdsAddress: string) {
        commit('SET_GLOBAL_KDS_ADDRESS', globalKdsAddress)
      },
    },
  }
}
