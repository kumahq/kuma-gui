import Vue from 'vue'
import Vuex, { Module } from 'vuex'

import config from '@/store/modules/config'
import sidebar from '@/store/modules/sidebar'

import { fetchAllResources, filterResourceByMesh } from '@/helpers'
import {
  getEmptyInsight,
  mergeInsightsReducer,
  parseInsightReducer
} from '@/store/reducers/mesh-insights'
import Kuma from '@/services/kuma'

type TODO = any

Vue.use(Vuex)

export type RootInterface = any

export default (api: Kuma): Module<RootInterface, RootInterface> => ({
  modules: {
    sidebar,
    config: config(api)
  },
  state: {
    menu: null,
    onboardingComplete: false,
    globalLoading: true,
    meshPageSize: 500,
    pageSize: 500,
    meshes: [],
    dataplanes: [],
    selectedMesh: 'all', // shows all meshes on initial load
    totalMeshCount: 0,
    totalInternalServiceCount: 0,
    totalExternalServiceCount: 0,
    totalDataplaneCount: 0,
    totalHealthCheckCount: 0,
    totalProxyTemplateCount: 0,
    totalTrafficLogCount: 0,
    totalTrafficPermissionCount: 0,
    totalTrafficRouteCount: 0,
    totalTrafficTraceCount: 0,
    totalFaultInjectionCount: 0,
    totalCircuitBreakerCount: 0,
    totalRateLimitCount: 0,
    totalRetryCount: 0,
    totalTimeoutCount: 0,
    totalDataplaneList: [],
    anyDataplanesOffline: null,
    // from mesh
    totalHealthCheckCountFromMesh: 0,
    totalProxyTemplateCountFromMesh: 0,
    totalTrafficLogCountFromMesh: 0,
    totalTrafficPermissionCountFromMesh: 0,
    totalTrafficRouteCountFromMesh: 0,
    totalTrafficTraceCountFromMesh: 0,
    totalFaultInjectionCountFromMesh: 0,
    totalCircuitBreakerCountFromMesh: 0,
    totalInternalServiceCountFromMesh: 0,
    totalExternalServiceCountFromMesh: 0,
    totalDataplaneCountFromMesh: 0,
    totalRateLimitCountFromMesh: 0,
    totalRetryCountFromMesh: 0,
    totalTimeoutCountFromMesh: 0,
    version: '',
    selectedTab: '#overview',
    selectedTableRow: null,
    storedWizardData: null,
    itemQueryNamespace: 'item',
    totalClusters: 0,

    // NEW
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
      }
    },
    overviewCharts: {
      dataplanes: {
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
    supportedVersionsFetching: false,
    supportedVersions: {},
    supportedVersionsFailed: '',
  } as TODO,
  getters: {
    getOnboardingStatus: (state) => state.onboardingComplete,
    globalLoading: (state) => state.globalLoading,
    getSelectedMesh: (state) => state.selectedMesh,
    getMeshList: (state) => state.meshes,
    getDataplanes: (state) => state.dataplanes,
    getDataplanesList: (state) => state.totalDataplaneList,
    getAnyDpOffline: (state) => state.anyDataplanesOffline,
    // total counts for all meshes
    getTotalMeshCount: (state) => state.totalMeshCount,
    getTotalInternalServiceCount: (state) => state.totalInternalServiceCount,
    getTotalExternalServiceCount: (state) => state.totalExternalServiceCount,
    getTotalDataplaneCount: (state) => state.totalDataplaneCount,
    getTotalHealthCheckCount: (state) => state.totalHealthCheckCount,
    getTotalProxyTemplateCount: (state) => state.totalProxyTemplateCount,
    getTotalTrafficLogCount: (state) => state.totalTrafficLogCount,
    getTotalTrafficPermissionCount: (state) => state.totalTrafficPermissionCount,
    getTotalTrafficRouteCount: (state) => state.totalTrafficRouteCount,
    getTotalTrafficTraceCount: (state) => state.totalTrafficTraceCount,
    getTotalFaultInjectionCount: (state) => state.totalFaultInjectionCount,
    getTotalCircuitBreakerCount: (state) => state.totalCircuitBreakerCount,
    getTotalRateLimitCount: (state) => state.totalRateLimitCount,
    getTotalRetryCount: (state) => state.totalRetryCount,
    getTotalTimeoutCount: (state) => state.totalTimeoutCount,
    // total counts per single mesh
    getTotalInternalServiceCountFromMesh: (state) => state.totalInternalServiceCountFromMesh,
    getTotalExternalServiceCountFromMesh: (state) => state.totalExternalServiceCountFromMesh,
    getTotalDataplaneCountFromMesh: (state) => state.totalDataplaneCountFromMesh,
    getTotalTrafficRoutesCountFromMesh: (state) => state.totalTrafficRouteCountFromMesh,
    getTotalTrafficPermissionsCountFromMesh: (state) => state.totalTrafficPermissionCountFromMesh,
    getTotalHealthChecksCountFromMesh: (state) => state.totalHealthCheckCountFromMesh,
    getTotalProxyTemplatesCountFromMesh: (state) => state.totalProxyTemplateCountFromMesh,
    getTotalTrafficLogsFromMesh: (state) => state.totalTrafficLogCountFromMesh,
    getTotalTrafficTracesCountFromMesh: (state) => state.totalTrafficTraceCountFromMesh,
    getTotalFaultInjectionsCountFromMesh: (state) => state.totalFaultInjectionCountFromMesh,
    getTotalCircuitBreakersCountFromMesh: (state) => state.totalCircuitBreakerCountFromMesh,
    getTotalRateLimitCountFromMesh: (state) => state.totalRateLimitCountFromMesh,
    getTotalRetryCountFromMesh: (state) => state.totalRetryCountFromMesh,
    getTotalTimeoutCountFromMesh: (state) => state.totalTimeoutCountFromMesh,

    getSelectedTab: (state) => state.selectedTab,
    getSelectedTableRow: (state) => state.selectedTableRow,

    getStoredWizardData: (state) => state.storedWizardData,
    getItemQueryNamespace: (state) => state.itemQueryNamespace,
    getClusterCount: (state) => state.totalClusters,
    getServiceInsightsFromMesh: ({ serviceInsights }) => {
      return filterResourceByMesh(serviceInsights)
    },
    getExternalServicesFromMesh: ({ externalServices }) => {
      return filterResourceByMesh(externalServices)
    },
    getMeshInsight: (state) => state.meshInsight,
    getMeshInsightsFetching: (state) => state.meshInsightsFetching,
    getServiceInsightsFetching: (state) => state.serviceInsightsFetching,
    getExternalServicesFetching: (state) => state.externalServicesFetching,
    getResourceFetching: ({
      meshInsightsFetching,
      serviceInsightsFetching,
      externalServicesFetching,
    }) => meshInsightsFetching || serviceInsightsFetching || externalServicesFetching,
    getServiceResourcesFetching: ({
      serviceInsightsFetching,
      externalServicesFetching,
    }) => serviceInsightsFetching || externalServicesFetching,
    getChart: ({ overviewCharts }) => (chartName: string) => overviewCharts[chartName],
    getZonesInsightsFetching: ({ zonesInsightsFetching }) => zonesInsightsFetching,
    getSupportedVersions: ({ supportedVersions }) => supportedVersions,
    getSupportedVersionsFetching: ({ supportedVersionsFetching }) => supportedVersionsFetching,
    getSupportedVersionsFailed: ({ supportedVersionsFailed }) => supportedVersionsFailed,
  },
  mutations: {
    SET_ONBOARDING_STATUS: (state, status) => (state.onboardingComplete = status),
    SET_GLOBAL_LOADING: (state, { globalLoading }) => (state.globalLoading = globalLoading),
    FETCH_ALL_MESHES: (state, meshes) => (state.meshes = meshes),
    FETCH_DATAPLANES_FROM_MESH: (state, dataplanes) => (state.dataplanes = dataplanes),
    SET_SELECTED_MESH: (state, mesh) => (state.selectedMesh = mesh),
    SET_TOTAL_MESH_COUNT: (state, count) => (state.totalMeshCount = count),
    SET_TOTAL_DATAPLANE_COUNT: (state, count) => (state.totalDataplaneCount = count),
    SET_TOTAL_INTERNAL_SERVICE_COUNT: (state, count) => (state.totalInternalServiceCount = count),
    SET_TOTAL_EXTERNAL_SERVICE_COUNT: (state, count) => (state.totalExternalServiceCount = count),
    SET_TOTAL_HEALTH_CHECK_COUNT: (state, count) => (state.totalHealthCheckCount = count),
    SET_TOTAL_PROXY_TEMPLATE_COUNT: (state, count) => (state.totalProxyTemplateCount = count),
    SET_TOTAL_TRAFFIC_LOG_COUNT: (state, count) => (state.totalTrafficLogCount = count),
    SET_TOTAL_TRAFFIC_PERMISSION_COUNT: (state, count) => (state.totalTrafficPermissionCount = count),
    SET_TOTAL_TRAFFIC_ROUTE_COUNT: (state, count) => (state.totalTrafficRouteCount = count),
    SET_TOTAL_TRAFFIC_TRACE_COUNT: (state, count) => (state.totalTrafficTraceCount = count),
    SET_TOTAL_DP_LIST: (state, dataplanes) => (state.totalDataplaneList = dataplanes),
    SET_TOTAL_FAULT_INJECTION_COUNT: (state, count) => (state.totalFaultInjectionCount = count),
    SET_TOTAL_CIRCUIT_BREAKER_COUNT: (state, count) => (state.totalCircuitBreakerCount = count),
    SET_TOTAL_RATE_LIMIT_COUNT: (state, count) => (state.totalRateLimitCount = count),
    SET_TOTAL_RETRY_COUNT: (state, count) => (state.totalRetryCount = count),
    SET_TOTAL_TIMEOUT_COUNT: (state, count) => (state.totalTimeoutCount = count),
    SET_TOTAL_DATAPLANE_COUNT_FROM_MESH: (state, count) => (state.totalDataplaneCountFromMesh = count),
    SET_TOTAL_INTERNAL_SERVICE_COUNT_FROM_MESH: (state, count) => (state.totalInternalServiceCountFromMesh = count),
    SET_TOTAL_EXTERNAL_SERVICE_COUNT_FROM_MESH: (state, count) => (state.totalExternalServiceCountFromMesh = count),
    SET_TOTAL_HEALTH_CHECK_COUNT_FROM_MESH: (state, count) => (state.totalHealthCheckCountFromMesh = count),
    SET_TOTAL_PROXY_TEMPLATE_COUNT_FROM_MESH: (state, count) => (state.totalProxyTemplateCountFromMesh = count),
    SET_TOTAL_TRAFFIC_LOG_COUNT_FROM_MESH: (state, count) => (state.totalTrafficLogCountFromMesh = count),
    SET_TOTAL_TRAFFIC_PERMISSION_COUNT_FROM_MESH: (state, count) => (state.totalTrafficPermissionCountFromMesh = count),
    SET_TOTAL_TRAFFIC_ROUTE_COUNT_FROM_MESH: (state, count) => (state.totalTrafficRouteCountFromMesh = count),
    SET_TOTAL_TRAFFIC_TRACE_COUNT_FROM_MESH: (state, count) => (state.totalTrafficTraceCountFromMesh = count),
    SET_TOTAL_FAULT_INJECTION_COUNT_FROM_MESH: (state, count) => (state.totalFaultInjectionCountFromMesh = count),
    SET_TOTAL_CIRCUIT_BREAKER_COUNT_FROM_MESH: (state, count) => (state.totalCircuitBreakerCountFromMesh = count),
    SET_TOTAL_RATE_LIMIT_COUNT_FROM_MESH: (state, count) => (state.totalRateLimitCountFromMesh = count),
    SET_TOTAL_RETRY_COUNT_FROM_MESH: (state, count) => (state.totalRetryCountFromMesh = count),
    SET_TOTAL_TIMEOUT_COUNT_FROM_MESH: (state, count) => (state.totalTimeoutCountFromMesh = count),
    SET_TOTAL_CLUSTER_COUNT: (state, count) => (state.totalClusters = count),
    SET_ANY_DP_OFFLINE: (state, status) => (state.anyDataplanesOffline = status),
    SET_NEW_TAB: (state, tab) => (state.selectedTab = tab),
    SET_NEW_TABLE_ROW: (state, row) => (state.selectedTableRow = row),
    SET_WIZARD_DATA: (state, value) => (state.storedWizardData = value),

    // NEW
    SET_INTERNAL_SERVICE_SUMMARY: (state, { data = [] } = {}) => {
      const { serviceSummary } = state

      const reducer = (acc: TODO, { status = 'offline' }) => ({
        ...acc,
        [status]: acc[status] + 1,
      })

      const initialState = { online: 0, partially_degraded: 0, offline: 0 }

      const {
        online,
        offline,
        partially_degraded: partiallyDegraded,
      } = data.reduce(reducer, initialState)

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
    SET_MESH_INSIGHT_FROM_ALL_MESHES: (state, value) => (state.meshInsight = mergeInsightsReducer(value.data)),
    SET_ZONES_INSIGHTS_FETCHING: (state, value) => (state.zonesInsightsFetching = value),
    SET_MESH_INSIGHTS_FETCHING: (state, value) => (state.meshInsightsFetching = value),
    SET_SERVICE_INSIGHTS_FETCHING: (state, value) => (state.serviceInsightsFetching = value),
    SET_EXTERNAL_SERVICES_FETCHING: (state, value) => (state.externalServicesFetching = value),
    SET_OVERVIEW_CHART_DATA: (state, value) => {
      const { chartName, data } = value

      state.overviewCharts[chartName].data = data
    },
    SET_SUPPORTED_VERSIONS_FETCHING: (state, value) => (state.supportedVersionsFetching = value),
    SET_SUPPORTED_VERSIONS: (state, value) => {
      state.supportedVersions = value
      state.supportedVersionsFailed = ''
    },
    SET_SUPPORTED_VERSIONS_FAILED: (state, value) => (state.supportedVersionsFailed = value),
  },
  actions: {
    // bootstrap app

    async bootstrap ({ commit, dispatch, getters, rootGetters }, routeMesh) {
      // check the API status before we do anything else
      await dispatch('config/getStatus', null, { root: true })

      // only dispatch these actions if the API is online
      if (rootGetters['config/getStatus'] === 'OK') {
        // fetch the mesh list
        dispatch('fetchMeshList')
        // fetch the tagline
        dispatch('config/getTagline')
        // fetch the config
        dispatch('config/getConfig')

        // fetch the version and store it in localStorage
        dispatch('config/getVersion')
          .then(() => {
            const newVersion = rootGetters['config/getVersion']
            const lsVersion = localStorage.getItem('kumaVersion') || null
            // if the version stored in the browser is different than the
            // version running, update the version in localStorage, and
            // reload the page

            if (lsVersion !== newVersion) {
              // reload the app
              window.location.reload()
              // update the version in localStorage
              localStorage.setItem('kumaVersion', newVersion)
            } else {
              commit('SET_GLOBAL_LOADING', { globalLoading: false })
            }
          })

        // set the selected mesh in localStorage
        const mesh = () => {
          const lsMesh = localStorage.getItem('selectedMesh')
          if (routeMesh) {
            // if the `mesh` param is present, use that
            return routeMesh
          } else if (lsMesh && lsMesh !== 'undefined' && lsMesh.length > 0) {
            // or use what's available in localStorage
            return lsMesh
          } else {
            // otherwise, fall back to the default value from our VueX store
            return getters.getSelectedMesh
          }
        }

        // set the selected mesh in our VueX store
        dispatch('updateSelectedMesh', mesh())
        // update the selected mesh in localStorage
        localStorage.setItem('selectedMesh', mesh())
      } else {
        commit('SET_GLOBAL_LOADING', { globalLoading: false })
      }
    },

    // update the onboarding state
    updateOnboardingStatus ({ commit }, status) {
      commit('SET_ONBOARDING_STATUS', status)
    },

    // fetch all of the meshes from the API
    fetchMeshList ({ commit, state }) {
      const params = {
        size: state.meshPageSize
      }

      return api.getAllMeshes(params)
        .then(response => {
          commit('FETCH_ALL_MESHES', response)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // fetch all dataplanes from a specific mesh
    fetchDataplanesFromMesh ({ commit }, mesh: string) {
      return api.getAllDataplanesFromMesh(mesh)
        .then(response => {
          commit('FETCH_DATAPLANES_FROM_MESH', response)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // update the selected mesh
    updateSelectedMesh ({ commit }, mesh) {
      commit('SET_SELECTED_MESH', mesh)
    },

    /**
       * Total Counts (for all items)
       *
       * Setting the `size` to 1 on these requests prevents
       * the unneeded listing of max 100 items.
       */

    // get total clusters (Zones) when in multicluster (or "Multi-Zone") mode
    fetchTotalClusterCount ({ commit }) {
      return api.getZones()
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_CLUSTER_COUNT', total)
        })
    },

    // get the total number of meshes
    fetchMeshTotalCount ({ commit, state }) {
      const params = {
        size: state.meshPageSize
      }

      return api.getAllMeshes(params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_MESH_COUNT', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of internal services present
    fetchInternalServiceTotalCount ({ commit }) {
      const params = { size: 1 }

      return api.getAllServiceInsights(params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_INTERNAL_SERVICE_COUNT', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of external services present
    fetchExternalServiceTotalCount ({ commit }) {
      const params = { size: 1 }

      return api.getAllExternalServices(params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_EXTERNAL_SERVICE_COUNT', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of dataplanes present
    fetchDataplaneTotalCount ({ commit }) {
      const params = { size: 1 }

      return api.getAllDataplanes(params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_DATAPLANE_COUNT', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of health checks present
    fetchHealthCheckTotalCount ({ commit }) {
      const params = { size: 1 }

      return api.getAllHealthChecks(params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_HEALTH_CHECK_COUNT', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of proxy templates present
    fetchProxyTemplateTotalCount ({ commit }) {
      const params = { size: 1 }

      return api.getAllProxyTemplates(params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_PROXY_TEMPLATE_COUNT', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of traffic logs present
    fetchTrafficLogTotalCount ({ commit }) {
      const params = { size: 1 }

      return api.getAllTrafficLogs(params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_TRAFFIC_LOG_COUNT', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of traffic permissions present
    fetchTrafficPermissionTotalCount ({ commit }) {
      const params = { size: 1 }

      return api.getAllTrafficPermissions(params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_TRAFFIC_PERMISSION_COUNT', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of traffic routes present
    fetchTrafficRouteTotalCount ({ commit }) {
      const params = { size: 1 }

      return api.getAllTrafficRoutes(params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_TRAFFIC_ROUTE_COUNT', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of traffic traces present
    fetchTrafficTraceTotalCount ({ commit }) {
      const params = { size: 1 }

      return api.getAllTrafficTraces(params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_TRAFFIC_TRACE_COUNT', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of fault injections present
    fetchFaultInjectionTotalCount ({ commit }) {
      const params = { size: 1 }

      return api.getAllFaultInjections(params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_FAULT_INJECTION_COUNT', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of circuit breakers present
    fetchCircuitBreakerTotalCount ({ commit }) {
      const params = { size: 1 }

      return api.getAllCircuitBreakers(params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_CIRCUIT_BREAKER_COUNT', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of rate limits present
    fetchRateLimitTotalCount ({ commit }) {
      const params = { size: 1 }

      return api.getAllRateLimits(params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_RATE_LIMIT_COUNT', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of retries present
    fetchRetryTotalCount ({ commit }) {
      const params = { size: 1 }

      return api.getAllRetries(params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_RETRY_COUNT', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of timeouts present
    fetchTimeoutTotalCount ({ commit }) {
      const params = { size: 1 }

      return api.getAllTimeouts(params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_TIMEOUT_COUNT', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    /**
       * Total counts (per mesh)
       */

    // get the total number of internal services from a specific mesh
    fetchInternalServiceTotalCountFromMesh ({ commit }, mesh) {
      const params = { size: 1 }

      return api.getAllServiceInsightsFromMesh(mesh, params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_INTERNAL_SERVICE_COUNT_FROM_MESH', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of external services from a specific mesh
    fetchExternalServiceTotalCountFromMesh ({ commit }, mesh) {
      const params = { size: 1 }

      return api.getAllExternalServicesFromMesh(mesh, params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_EXTERNAL_SERVICE_COUNT_FROM_MESH', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of dataplanes from a specific mesh
    fetchDataplaneTotalCountFromMesh ({ commit }, mesh) {
      const params = { size: 1 }

      return api.getAllDataplanesFromMesh(mesh, params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_DATAPLANE_COUNT_FROM_MESH', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of health checks from a specific mesh
    fetchHealthCheckTotalCountFromMesh ({ commit }, mesh) {
      const params = { size: 1 }

      return api.getAllHealthChecksFromMesh(mesh, params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_HEALTH_CHECK_COUNT_FROM_MESH', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of proxy templates from a specific mesh
    fetchProxyTemplateTotalCountFromMesh ({ commit }, mesh) {
      const params = { size: 1 }

      return api.getAllProxyTemplatesFromMesh(mesh, params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_PROXY_TEMPLATE_COUNT_FROM_MESH', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of traffic logs from a specific mesh
    fetchTrafficLogTotalCountFromMesh ({ commit }, mesh) {
      const params = { size: 1 }

      return api.getAllTrafficLogsFromMesh(mesh, params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_TRAFFIC_LOG_COUNT_FROM_MESH', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of traffic permissions from a specific mesh
    fetchTrafficPermissionTotalCountFromMesh ({ commit }, mesh) {
      const params = { size: 1 }

      return api.getAllTrafficPermissionsFromMesh(mesh, params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_TRAFFIC_PERMISSION_COUNT_FROM_MESH', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of traffic routes from a specific mesh
    fetchTrafficRouteTotalCountFromMesh ({ commit }, mesh) {
      const params = { size: 1 }

      return api.getAllTrafficRoutesFromMesh(mesh, params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_TRAFFIC_ROUTE_COUNT_FROM_MESH', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of traffic traces from a specific mesh
    fetchTrafficTraceTotalCountFromMesh ({ commit }, mesh) {
      const params = { size: 1 }

      return api.getAllTrafficTracesFromMesh(mesh, params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_TRAFFIC_TRACE_COUNT_FROM_MESH', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of fault injections from a specific mesh
    fetchFaultInjectionTotalCountFromMesh ({ commit }, mesh) {
      const params = { size: 1 }

      return api.getAllFaultInjectionsFromMesh(mesh, params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_FAULT_INJECTION_COUNT_FROM_MESH', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of circuit breakers from a specific mesh
    fetchCircuitBreakerTotalCountFromMesh ({ commit }, mesh) {
      const params = { size: 1 }

      return api.getAllCircuitBreakersFromMesh(mesh, params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_CIRCUIT_BREAKER_COUNT_FROM_MESH', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of rate limits from a specific mesh
    fetchRateLimitTotalCountFromMesh ({ commit }, mesh) {
      const params = { size: 1 }

      return api.getAllRateLimitsFromMesh(mesh, params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_RATE_LIMIT_COUNT_FROM_MESH', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of retries from a specific mesh
    fetchRetryTotalCountFromMesh ({ commit }, mesh) {
      const params = { size: 1 }

      return api.getAllRetriesFromMesh(mesh, params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_RETRY_COUNT_FROM_MESH', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // get the total number of timeouts from a specific mesh
    fetchTimeoutTotalCountFromMesh ({ commit }, mesh) {
      const params = { size: 1 }

      return api.getAllTimeoutsFromMesh(mesh, params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_TIMEOUT_COUNT_FROM_MESH', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    /**
       * Dataplane statuses
       */

    // this will get the current status of all dataplanes
    getAllDataplanes ({ commit }, params) {
      const getDataplanes = async () => {
        return new Promise<void>(async (resolve, reject) => {
          const result = []
          const states = []

          const dataplanes = await api.getAllDataplanes(params)
          const items = await dataplanes.items

          for (let i = 0; i < items.length; i++) {
            const itemName = items[i].name
            const itemMesh = items[i].mesh

            const itemStatus = await api.getDataplaneOverviewFromMesh(itemMesh, itemName)
              .then(response => {
                const items = response.dataplaneInsight.subscriptions

                if (items && items.length > 0) {
                  for (let i = 0; i < items.length; i++) {
                    const connectTime = items[i].connectTime
                    const disconnectTime = items[i].disconnectTime

                    if (connectTime && connectTime.length && !disconnectTime) {
                      return 'Online'
                    }
                  }
                }

                return 'Offline'
              })

            // create the full data array
            result.push({
              status: itemStatus,
              name: itemName,
              mesh: itemMesh
            })
          }

          // create a simple flat status object with booleans for checking
          // if any dataplanes are offline
          for (let i = 0; i < Object.values(result).length; i++) {
            const statusVal = Object.values(result[i])[0]
            const isOnline = !(statusVal === 'Offline' || statusVal === 'offline')

            states.push(isOnline)
          }

          // if any of the dataplanes return false for being online
          // commit this so we can check against it
          const anyDpOffline = states.some(i => i === false)

          commit('SET_ANY_DP_OFFLINE', anyDpOffline)

          // commit the total list of dataplanes
          commit('SET_TOTAL_DP_LIST', result)

          // resolve the promise
          resolve()
        })
      }

      return getDataplanes()
    },

    // allows us to set the selected tab outside of the Tabs component
    updateSelectedTab ({ commit }, tab) {
      commit('SET_NEW_TAB', tab)
    },

    // set the selected table row in the state
    updateSelectedTableRow ({ commit }, row) {
      commit('SET_NEW_TABLE_ROW', row)
    },

    // update the stored Wizard data for use in generating code output
    updateWizardData ({ commit }, value) {
      commit('SET_WIZARD_DATA', value)
    },

    // NEW

    async fetchMeshInsights ({ commit, dispatch, state }, mesh = 'all') {
      commit('SET_MESH_INSIGHTS_FETCHING', true)

      try {
        if (mesh === 'all') {
          const params = {
            callEndpoint: api.getAllMeshInsights.bind(api),
            size: state.pageSize,
          }

          commit('SET_MESH_INSIGHT_FROM_ALL_MESHES', await fetchAllResources(params))
        } else {
          commit('SET_MESH_INSIGHT', await api.getMeshInsights(mesh))
        }
      } catch (e) {
        commit('SET_MESH_INSIGHT', getEmptyInsight())
      } finally {
        dispatch('setChartsFromMeshInsights')
      }

      commit('SET_MESH_INSIGHTS_FETCHING', false)
    },

    async fetchServiceInsights ({ commit, state }, mesh = 'all') {
      commit('SET_SERVICE_INSIGHTS_FETCHING', true)

      try {
        const params = {
          callEndpoint: mesh === 'all'
            ? api.getAllServiceInsights.bind(api)
            : api.getAllServiceInsightsFromMesh.bind(api, mesh),
          size: state.pageSize,
        }

        commit('SET_INTERNAL_SERVICE_SUMMARY', await fetchAllResources(params))
      } catch (e) {
        commit('SET_INTERNAL_SERVICE_SUMMARY')
      }

      commit('SET_SERVICE_INSIGHTS_FETCHING', false)
    },

    async fetchExternalServices ({ commit, state, dispatch }, mesh = 'all') {
      commit('SET_EXTERNAL_SERVICES_FETCHING', true)

      try {
        const params = {
          callEndpoint: mesh === 'all'
            ? api.getAllExternalServices.bind(api)
            : api.getAllExternalServicesFromMesh.bind(api, mesh),
          size: state.pageSize,
        }

        commit('SET_EXTERNAL_SERVICE_SUMMARY', await fetchAllResources(params))
      } catch (e) {
        commit('SET_EXTERNAL_SERVICE_SUMMARY')
      }

      commit('SET_EXTERNAL_SERVICES_FETCHING', false)
    },

    async fetchServices ({ dispatch }, mesh = 'all') {
      const externalServices = dispatch('fetchExternalServices', mesh)
      const serviceInsights = dispatch('fetchServiceInsights', mesh)

      await Promise.all([serviceInsights, externalServices])
      await dispatch('setOverviewServicesChartData')
    },

    async fetchZonesInsights ({ commit, dispatch, state }, multicluster = false) {
      commit('SET_ZONES_INSIGHTS_FETCHING', true)

      try {
        if (multicluster) {
          const params = {
            callEndpoint: api.getAllZoneOverviews.bind(api),
            size: state.pageSize,
          }

          const overviews = await fetchAllResources(params)
          const statuses = await api.getZoneStatus({ size: state.pageSize })

          dispatch('setOverviewZonesChartData', statuses)
          dispatch('setOverviewZonesCPVersionsChartData', overviews)
        } else {
          await dispatch('config/getVersion')

          const zonesData = [{
            category: 'Zone',
            value: 1,
            tooltipDisabled: true,
            labelDisabled: true,
          }]

          const versionsData = [{
            category: state.version,
            value: 1,
            tooltipDisabled: true,
          }]

          commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zones', data: zonesData })
          commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zonesCPVersions', data: versionsData })
        }
      } catch (e) {
        commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zones', data: [] })
        commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zonesCPVersions', data: [] })
      }

      commit('SET_ZONES_INSIGHTS_FETCHING', false)
    },

    setChartsFromMeshInsights ({ dispatch }) {
      dispatch('setOverviewDataplanesChartData')
      dispatch('setOverviewKumaDPVersionsChartData')
      dispatch('setOverviewEnvoyVersionsChartData')
    },

    setOverviewZonesChartData({ state, commit }, statuses = []) {
      const total = statuses.length
      const online = statuses.filter(({ active }: { active: boolean }) => active).length

      const chartData = []

      if (total) {
        chartData.push({
          category: 'Online',
          value: online,
        })

        if (online !== total) {
          chartData.push({
            category: 'Offline',
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
        })
      }

      if (external.total) {
        data.push({
          category: 'External',
          value: external.total,
          minSizeForLabel: 0.16,
        })
      }

      commit('SET_OVERVIEW_CHART_DATA', { chartName: 'services', data })
    },

    setOverviewDataplanesChartData({ state, commit }) {
      const { dataplanes } = state.meshInsight
      const { total, online, partiallyDegraded = 0 } = dataplanes

      const data = []

      if (total) {
        data.push({
          category: 'Online',
          value: online,
        })

        if (partiallyDegraded) {
          data.push({
            category: 'Partially Degraded',
            value: partiallyDegraded,
          })
        }

        if (online + partiallyDegraded !== total) {
          data.push({
            category: 'Offline',
            value: total - partiallyDegraded - online,
          })
        }
      }

      commit('SET_OVERVIEW_CHART_DATA', { chartName: 'dataplanes', data })
    },

    setOverviewZonesCPVersionsChartData({ state, commit }, { data }) {
      const chartData = data.reduce((acc: TODO, curr: TODO) => {
        const { subscriptions } = curr.zoneInsight

        if (!subscriptions.length) {
          return acc
        }

        const { version } = curr.zoneInsight.subscriptions.pop()

        const item = acc.find(({ category }: { category: TODO }) => category === version.kumaCp.version)

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

      const data = Object.entries(envoy)
        .map(([version, stats]: [TODO, TODO]) => ({ category: version, value: stats.total }))

      commit('SET_OVERVIEW_CHART_DATA', { chartName: 'envoyVersions', data })
    },

    setOverviewKumaDPVersionsChartData({ state, commit }) {
      const { kumaDp } = state.meshInsight.dpVersions

      const data = Object.entries(kumaDp)
        .map(([version, stats]: [TODO, TODO]) => ({ category: version, value: stats.total }))

      commit('SET_OVERVIEW_CHART_DATA', { chartName: 'kumaDPVersions', data })
    },

    async fetchSupportedVersions ({ commit }) {
      commit('SET_SUPPORTED_VERSIONS_FETCHING', true)

      try {
        commit('SET_SUPPORTED_VERSIONS', await api.getSupportedVersions())
      } catch (e) {
        commit('SET_SUPPORTED_VERSIONS_FAILED', e.toString())
      }

      commit('SET_SUPPORTED_VERSIONS_FETCHING', false)
    },
  },
})
