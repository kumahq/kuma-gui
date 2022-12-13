import { StoreOptions } from 'vuex'

import { ConfigInterface } from './modules/config/config.types'
import { NotificationsInterface } from './modules/notifications/notifications.types'
import { OnboardingInterface } from './modules/onboarding/onboarding.types'
import { SidebarInterface } from './modules/sidebar/sidebar.types'
import { getItemStatusFromInsight } from '@/utilities/dataplane'
import { PAGE_REQUEST_SIZE_DEFAULT } from '@/constants'
import config from '@/store/modules/config/config'
import notifications from '@/store/modules/notifications/notifications'
import onboarding from '@/store/modules/onboarding/onboarding'
import sidebar from '@/store/modules/sidebar/sidebar'

import { fetchAllResources } from '@/utilities/helpers'
import { getEmptyInsight, mergeInsightsReducer, parseInsightReducer } from '@/store/reducers/mesh-insights'
import { kumaApi } from '@/api/kumaApi'
import { ClientStorage } from '@/utilities/ClientStorage'
import { Mesh, PolicyDefinition } from '@/types/index.d'

const ONLINE = 'Online'
const OFFLINE = 'Offline'
const PARTIALLY_DEGRADED = 'Partially degraded'

type TODO = any

/**
 * The root state of the application’s Vuex store minus all module state.
 */
interface BareRootState {
  menu: null
  globalLoading: boolean
  pageTitle: string
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
  overviewCharts: Record<string, { data: any[] }>
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
  policies: PolicyDefinition[]
  policiesByPath: Record<string, PolicyDefinition>
  policiesByType: Record<string, PolicyDefinition>
}

const initialState: BareRootState = {
  menu: null,
  globalLoading: true,
  pageTitle: '',
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
  policies: [],
  policiesByPath: {},
  policiesByType: {},
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

export const storeConfig: StoreOptions<State> = {
  modules: {
    sidebar,
    config,
    notifications,
    onboarding,
  },
  // Explicitly asserts `initialState` to be of type `State` (which includes module state) even though `initialSate` doesn’t include module state. This is necessary because otherwise the result of creating a store from `storeConfig` and `State` will be a store (i.e. `Store<State>`) that, according to its type, is missing all module state which it actually doesn’t. Vuex’s types aren’t complete and don’t account for this scenario. Without this workaround, accessing module state without a type guard would always produce a TypeScript error.
  state: () => initialState as State,
  getters: {
    globalLoading: state => state.globalLoading,
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
    getChart: ({ overviewCharts }) => (chartName: string) => overviewCharts[chartName],
    getZonesInsightsFetching: ({ zonesInsightsFetching }) => zonesInsightsFetching,
  },
  mutations: {
    SET_GLOBAL_LOADING: (state, { globalLoading }) => (state.globalLoading = globalLoading),
    SET_PAGE_TITLE: (state, pageTitle) => (state.pageTitle = pageTitle),
    SET_MESHES: (state, meshes) => (state.meshes = meshes),
    SET_SELECTED_MESH: (state, mesh) => (state.selectedMesh = mesh),
    SET_TOTAL_DATAPLANE_COUNT: (state, count) => (state.totalDataplaneCount = count),
    SET_TOTAL_CLUSTER_COUNT: (state, count) => (state.totalClusters = count),
    SET_INTERNAL_SERVICE_SUMMARY: (state, { items = [] } = {}) => {
      const { serviceSummary } = state

      const reducer = (acc: TODO, { status = 'offline' }) => ({
        ...acc,
        [status]: acc[status] + 1,
      })

      const initialItemsState = { online: 0, partially_degraded: 0, offline: 0 }

      const { online, offline, partially_degraded: partiallyDegraded } = items.reduce(reducer, initialItemsState)

      const total = online + offline + partiallyDegraded

      serviceSummary.internal = {
        ...serviceSummary.internal,
        total,
        online,
        partiallyDegraded,
        offline,
      }

      serviceSummary.total = serviceSummary.external.total + total
    },
    SET_EXTERNAL_SERVICE_SUMMARY: (state, { total = 0 } = {}) => {
      state.serviceSummary.external.total = total
      state.serviceSummary.total = state.serviceSummary.internal.total + total
    },
    SET_MESH_INSIGHT: (state, value) => (state.meshInsight = parseInsightReducer(value)),
    SET_MESH_INSIGHT_FROM_ALL_MESHES: (state, value) => (state.meshInsight = mergeInsightsReducer(value.items)),
    SET_ZONES_INSIGHTS_FETCHING: (state, value) => (state.zonesInsightsFetching = value),
    SET_MESH_INSIGHTS_FETCHING: (state, value) => (state.meshInsightsFetching = value),
    SET_SERVICE_INSIGHTS_FETCHING: (state, value) => (state.serviceInsightsFetching = value),
    SET_EXTERNAL_SERVICES_FETCHING: (state, value) => (state.externalServicesFetching = value),
    SET_OVERVIEW_CHART_DATA: (state, value: { chartName: string, data: any }) => {
      const { chartName, data } = value

      state.overviewCharts[chartName].data = data
    },
    SET_POLICIES: (state, policies) => (state.policies = policies),
    SET_POLICIES_BY_PATH: (state, policiesByPath) => (state.policiesByPath = policiesByPath),
    SET_POLICIES_BY_TYPE: (state, policiesByType) => (state.policiesByType = policiesByType),
  },
  actions: {
    async bootstrap({ commit, dispatch, getters, state }) {
      commit('SET_GLOBAL_LOADING', { globalLoading: true })

      // check the Kuma status before we do anything else
      await dispatch('config/getStatus')

      // only dispatch these actions if the Kuma is online
      if (getters['config/getStatus'] === 'OK') {
        // Sets selected mesh from client storage.
        const storedMesh = ClientStorage.get('selectedMesh')
        if (storedMesh) {
          dispatch('updateSelectedMesh', storedMesh)
        }

        await Promise.all([
          dispatch('fetchMeshList'),
          dispatch('fetchDataplaneTotalCount'),
          dispatch('config/bootstrapConfig'),
          dispatch('sidebar/getInsights'),
        ])

        if (state.meshes.items.length === 0) {
          dispatch('updateSelectedMesh', null)
        } else {
          // Updates the selected mesh if one wasn’t read earlier or if it’s not an existing mesh.
          const newStoredMesh = ClientStorage.get('selectedMesh')
          if (newStoredMesh === null || !state.meshes.items.some((mesh) => mesh.name === newStoredMesh)) {
            dispatch('updateSelectedMesh', state.meshes.items[0].name)
          }
        }
      }

      commit('SET_GLOBAL_LOADING', { globalLoading: false })
    },

    updatePageTitle({ commit }, pageTitle: string) {
      commit('SET_PAGE_TITLE', pageTitle)
    },

    // fetch all of the meshes from the Kuma
    async fetchMeshList({ commit }) {
      const params = {
        size: PAGE_REQUEST_SIZE_DEFAULT,
      }

      try {
        const response = await kumaApi.getAllMeshes(params)

        if (Array.isArray(response.items)) {
          response.items.sort((meshA, meshB) => {
            // Prioritizes the mesh named “default”.
            if (meshA.name === 'default') {
              return -1
            } else if (meshB.name === 'default') {
              return 1
            }

            return meshA.name.localeCompare(meshB.name)
          })
        } else {
          response.items = []
        }

        commit('SET_MESHES', response)
      } catch (error) {
        console.error(error)
      }
    },

    // update the selected mesh
    updateSelectedMesh({ commit }, mesh: string | null) {
      if (mesh !== null) {
        ClientStorage.set('selectedMesh', mesh)
      } else {
        ClientStorage.remove('selectedMesh')
      }

      commit('SET_SELECTED_MESH', mesh)
    },

    /**
     * Total Counts (for all items)
     */

    // get total clusters (Zones) when in multicluster (or "Multi-Zone") mode
    fetchTotalClusterCount({ commit }) {
      return kumaApi.getZones().then(response => {
        const total = response.total

        commit('SET_TOTAL_CLUSTER_COUNT', total)
      })
    },

    // get the total number of dataplanes present
    fetchDataplaneTotalCount({ commit }) {
      const params = { size: 1 }

      return kumaApi.getAllDataplanes(params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_DATAPLANE_COUNT', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // NEW

    async fetchMeshInsights({ commit, dispatch }, mesh: string | undefined) {
      commit('SET_MESH_INSIGHTS_FETCHING', true)

      try {
        if (mesh === undefined) {
          const response = await fetchAllResources(kumaApi.getAllMeshInsights.bind(kumaApi))
          const meshesData = []

          if (response.items.length > 0) {
            meshesData.push({
              category: 'Mesh',
              value: response.items.length,
              tooltipDisabled: true,
              labelDisabled: true,
            })
          }

          commit('SET_OVERVIEW_CHART_DATA', { chartName: 'meshes', data: meshesData })
          commit('SET_MESH_INSIGHT_FROM_ALL_MESHES', response)
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
        const endpoint =
            mesh === undefined
              ? kumaApi.getAllServiceInsights.bind(kumaApi)
              : kumaApi.getAllServiceInsightsFromMesh.bind(kumaApi, { mesh })
        commit('SET_INTERNAL_SERVICE_SUMMARY', await fetchAllResources(endpoint))
      } catch {
        commit('SET_INTERNAL_SERVICE_SUMMARY')
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
        commit('SET_EXTERNAL_SERVICE_SUMMARY')
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

          dispatch('setOverviewZonesChartData', data)
          dispatch('setOverviewZonesCPVersionsChartData', data)
        } else {
          const zonesData = [
            {
              category: 'Zone',
              value: 1,
              tooltipDisabled: true,
              labelDisabled: true,
            },
          ]

          const versionsData = [
            {
              category: getters['config/getVersion'],
              value: 1,
              tooltipDisabled: true,
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

    async fetchPolicies({ commit }) {
      const { policies } = await kumaApi.getPolicyDefinitions()
      const policiesByPath = policies.reduce((obj, policy) => Object.assign(obj, { [policy.path]: policy }), {})
      const policiesByType = policies.reduce((obj, policy) => Object.assign(obj, { [policy.name]: policy }), {})

      commit('SET_POLICIES', policies)
      commit('SET_POLICIES_BY_PATH', policiesByPath)
      commit('SET_POLICIES_BY_TYPE', policiesByType)
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

      const chartData = []

      if (total) {
        chartData.push({
          category: ONLINE,
          value: online,
        })

        if (online !== total) {
          chartData.push({
            category: OFFLINE,
            value: total - online,
          })
        }
      }

      commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zones', data: chartData })
    },

    setOverviewServicesChartData({ state, commit }) {
      const { internal, external } = state.serviceSummary

      const data = []

      if (internal.total) {
        data.push({
          category: 'Internal',
          value: internal.total,
          minSizeForLabel: 0.16,
          route: {
            name: 'service-list-view',
            params: {
              mesh: state.selectedMesh,
            },
          },
        })
      }

      if (external.total) {
        data.push({
          category: 'External',
          value: external.total,
          minSizeForLabel: 0.16,
          route: {
            name: 'service-list-view',
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
      const online = state.meshInsight.dataplanes.online ?? 0
      const partiallyDegraded = state.meshInsight.dataplanes.partiallyDegraded ?? 0

      const data = []

      if (total) {
        data.push({
          category: ONLINE,
          value: online,
        })

        if (partiallyDegraded) {
          data.push({
            category: PARTIALLY_DEGRADED,
            value: partiallyDegraded,
          })
        }

        if (online + partiallyDegraded !== total) {
          data.push({
            category: OFFLINE,
            value: total - partiallyDegraded - online,
          })
        }
      }

      commit('SET_OVERVIEW_CHART_DATA', { chartName: 'dataplanes', data })
    },

    setOverviewZonesCPVersionsChartData({ commit }, { items }) {
      const chartData = items.reduce((acc: TODO, curr: TODO) => {
        const { subscriptions } = curr.zoneInsight

        if (!subscriptions.length) {
          return acc
        }

        const { version } = curr.zoneInsight.subscriptions.pop()

        const item = acc.find(({ category }: { category: TODO }) => category === version?.kumaCp?.version)

        if (!item) {
          acc.push({ category: version.kumaCp.version, value: 1 })
        } else {
          item.value++
        }

        return acc
      }, [])

      commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zonesCPVersions', data: chartData })
    },

    setOverviewEnvoyVersionsChartData({ state, commit }) {
      const { envoy } = state.meshInsight.dpVersions

      const data = Object.entries(envoy).map(([version, stats]: [TODO, TODO]) => ({
        category: version,
        value: stats.total,
      }))

      commit('SET_OVERVIEW_CHART_DATA', { chartName: 'envoyVersions', data })
    },

    setOverviewKumaDPVersionsChartData({ state, commit }) {
      const { kumaDp } = state.meshInsight.dpVersions

      const data = Object.entries(kumaDp).map(([version, stats]: [TODO, TODO]) => ({
        category: version,
        value: stats.total,
      }))

      commit('SET_OVERVIEW_CHART_DATA', { chartName: 'kumaDPVersions', data })
    },
  },
}
