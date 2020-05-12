import Vue from 'vue'
import Vuex from 'vuex'

import sidebar from '@/store/modules/sidebar'
// import workspaces from '@/store/modules/workspaces'

Vue.use(Vuex)

export default (api) => {
  const store = new Vuex.Store({
    modules: {
      sidebar
      // workspaces
    },
    state: {
      config: null,
      environment: null,
      onboardingComplete: false,
      globalLoading: null,
      meshPageSize: 500,
      meshes: [],
      dataplanes: [],
      selectedMesh: 'all', // shows all meshes on initial load
      totalMeshCount: 0,
      totalDataplaneCount: 0,
      totalHealthCheckCount: 0,
      totalProxyTemplateCount: 0,
      totalTrafficLogCount: 0,
      totalTrafficPermissionCount: 0,
      totalTrafficRouteCount: 0,
      totalTrafficTraceCount: 0,
      totalFaultInjectionCount: 0,
      totalDataplaneList: [],
      anyDataplanesOffline: null,
      totalDataplaneCountFromMesh: 0,
      totalTrafficRoutesCountFromMesh: 0,
      totalTrafficPermissionsCountFromMesh: 0,
      totalTrafficLogsCountFromMesh: 0,
      totalTrafficTracesCountFromMesh: 0,
      totalFaultInjectionsCountFromMesh: 0,
      totalHealthChecksCountFromMesh: 0,
      totalProxyTemplatesCountFromMesh: 0,
      tagline: null,
      version: null,
      status: null,
      selectedTab: '#overview',
      selectedTableRow: null,
      storedWizardData: null
    },
    getters: {
      getOnboardingStatus: (state) => state.onboardingComplete,
      globalLoading: (state) => state.globalLoading,
      getSelectedMesh: (state) => state.selectedMesh,
      getMeshList: (state) => state.meshes,
      getDataplanes: (state) => state.dataplanes,
      getDataplanesList: (state) => state.totalDataplaneList,
      getAnyDpOffline: (state) => state.anyDataplanesOffline,
      getTotalMeshCount: (state) => state.totalMeshCount,
      getTotalDataplaneCount: (state) => state.totalDataplaneCount,
      getTotalHealthCheckCount: (state) => state.totalHealthCheckCount,
      getTotalProxyTemplateCount: (state) => state.totalProxyTemplateCount,
      getTotalTrafficLogCount: (state) => state.totalTrafficLogCount,
      getTotalTrafficPermissionCount: (state) => state.totalTrafficPermissionCount,
      getTotalTrafficRouteCount: (state) => state.totalTrafficRouteCount,
      getTotalTrafficTraceCount: (state) => state.totalTrafficTraceCount,
      getTotalFaultInjectionCount: (state) => state.totalFaultInjectionCount,
      getTotalDataplaneCountFromMesh: (state) => state.totalDataplaneCountFromMesh,
      getTotalTrafficRoutesCountFromMesh: (state) => state.totalTrafficRoutesCountFromMesh,
      getTotalTrafficPermissionsCountFromMesh: (state) => state.totalTrafficPermissionsCountFromMesh,
      getTotalHealthChecksFromMesh: (state) => state.totalHealthChecksCountFromMesh,
      getTotalProxyTemplatesCountFromMesh: (state) => state.totalProxyTemplatesCountFromMesh,
      getTrafficLogsFromMeshTotalCount: (state) => state.totalTrafficLogsCountFromMesh,
      getTrafficTracesFromMeshTotalCount: (state) => state.totalTrafficTracesCountFromMesh,
      getFaultInjectionsFromMeshTotalCount: (state) => state.totalFaultInjectionsCountFromMesh,
      getVersion: (state) => state.version,
      getTagline: (state) => state.tagline,
      getStatus: (state) => state.status,
      getConfig: (state) => state.config,
      getSelectedTab: (state) => state.selectedTab,
      getSelectedTableRow: (state) => state.selectedTableRow,
      getEnvironment: (state) => state.environment,
      getStoredWizardData: (state) => state.storedWizardData
    },
    mutations: {
      SET_ONBOARDING_STATUS: (state, status) => (state.onboardingComplete = status),
      SET_GLOBAL_LOADING: (state, { globalLoading }) => (state.globalLoading = globalLoading),
      FETCH_ALL_MESHES: (state, meshes) => (state.meshes = meshes),
      FETCH_DATAPLANES_FROM_MESH: (state, dataplanes) => (state.dataplanes = dataplanes),
      SET_SELECTED_MESH: (state, mesh) => (state.selectedMesh = mesh),
      SET_TOTAL_MESH_COUNT: (state, count) => (state.totalMeshCount = count),
      SET_TOTAL_DATAPLANE_COUNT: (state, count) => (state.totalDataplaneCount = count),
      SET_TOTAL_HEALTH_CHECK_COUNT: (state, count) => (state.totalHealthCheckCount = count),
      SET_TOTAL_PROXY_TEMPLATE_COUNT: (state, count) => (state.totalProxyTemplateCount = count),
      SET_TOTAL_TRAFFIC_LOG_COUNT: (state, count) => (state.totalTrafficLogCount = count),
      SET_TOTAL_TRAFFIC_PERMISSION_COUNT: (state, count) => (state.totalTrafficPermissionCount = count),
      SET_TOTAL_TRAFFIC_ROUTE_COUNT: (state, count) => (state.totalTrafficRouteCount = count),
      SET_TOTAL_TRAFFIC_TRACE_COUNT: (state, count) => (state.totalTrafficTraceCount = count),
      SET_TOTAL_DP_LIST: (state, dataplanes) => (state.totalDataplaneList = dataplanes),
      SET_TOTAL_FAULT_INJECTION_COUNT: (state, count) => (state.totalFaultInjectionCount = count),
      SET_ANY_DP_OFFLINE: (state, status) => (state.anyDataplanesOffline = status),
      SET_TOTAL_DATAPLANE_COUNT_FROM_MESH: (state, count) => (state.totalDataplaneCountFromMesh = count),
      SET_TOTAL_TRAFFIC_ROUTES_COUNT_FROM_MESH: (state, count) => (state.totalTrafficRoutesCountFromMesh = count),
      SET_TOTAL_TRAFFIC_PERMISSIONS_COUNT_FROM_MESH: (state, count) => (state.totalTrafficPermissionsCountFromMesh = count),
      SET_TOTAL_TRAFFIC_LOGS_COUNT_FROM_MESH: (state, count) => (state.totalTrafficLogsCountFromMesh = count),
      SET_TOTAL_TRAFFIC_TRACES_COUNT_FROM_MESH: (state, count) => (state.totalTrafficTracesCountFromMesh = count),
      SET_TOTAL_FAULT_INJECTIONS_COUNT_FROM_MESH: (state, count) => (state.totalFaultInjectionsCountFromMesh = count),
      SET_TOTAL_HEALTH_CHECKS_COUNT_FROM_MESH: (state, count) => (state.totalHealthChecksCountFromMesh = count),
      SET_TOTAL_PROXY_TEMPLATE_COUNT_FROM_MESH: (state, count) => (state.totalProxyTemplatesCountFromMesh = count),
      SET_VERSION: (state, version) => (state.version = version),
      SET_TAGLINE: (state, tagline) => (state.tagline = tagline),
      SET_STATUS: (state, status) => (state.status = status),
      SET_CONFIG_DATA: (state, config) => (state.config = config),
      SET_NEW_TAB: (state, tab) => (state.selectedTab = tab),
      SET_NEW_TABLE_ROW: (state, row) => (state.selectedTableRow = row),
      SET_ENVIRONMENT: (state, value) => (state.environment = value),
      SET_WIZARD_DATA: (state, value) => (state.storedWizardData = value)
    },
    actions: {
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
      fetchDataplanesFromMesh ({ commit }, mesh) {
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
       * Total Counts
       *
       * Setting the `size` to 1 on these requests prevents
       * the unneeded listing of max 100 items.
       */

      // get the total number of meshes
      getMeshTotalCount ({ commit, state }) {
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

      // get the total number of dataplanes present
      getDataplaneTotalCount ({ commit }) {
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
      getHealthCheckTotalCount ({ commit }) {
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
      getProxyTemplateTotalCount ({ commit }) {
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
      getTrafficLogTotalCount ({ commit }) {
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
      getTrafficPermissionTotalCount ({ commit }) {
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
      getTrafficRouteTotalCount ({ commit }) {
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
      getTrafficTraceTotalCount ({ commit }) {
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
      getFaultInjectionTotalCount ({ commit }) {
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

      // this will get the current status of all dataplanes
      getAllDataplanes ({ commit }, params) {
        const getDataplanes = async () => {
          return new Promise(async (resolve, reject) => {
            const result = []
            const states = []

            const dataplanes = await api.getAllDataplanes(params)
            const items = await dataplanes.items

            for (let i = 0; i < items.length; i++) {
              const itemName = items[i].name
              const itemMesh = items[i].mesh

              const itemStatus = await api.getDataplaneOverviewsFromMesh(itemMesh, itemName)
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

      // get the total number of dataplanes from a mesh
      getDataplaneFromMeshTotalCount ({ commit }, mesh) {
        return api.getAllDataplanesFromMesh(mesh)
          .then(response => {
            const total = response.items.length

            commit('SET_TOTAL_DATAPLANE_COUNT_FROM_MESH', total)
          })
          .catch(error => {
            console.error(error)
          })
      },

      // get the total number of traffic routes from a mesh
      getTrafficRoutesFromMeshTotalCount ({ commit }, mesh) {
        return api.getAllTrafficRoutesFromMesh(mesh)
          .then(response => {
            const total = response.items.length

            commit('SET_TOTAL_TRAFFIC_ROUTES_COUNT_FROM_MESH', total)
          })
          .catch(error => {
            console.error(error)
          })
      },

      // get the total number of traffic permissions from a mesh
      getTrafficPermissionsFromMeshTotalCount ({ commit }, mesh) {
        return api.getAllTrafficPermissionsFromMesh(mesh)
          .then(response => {
            const total = response.items.length

            commit('SET_TOTAL_TRAFFIC_PERMISSIONS_COUNT_FROM_MESH', total)
          })
          .catch(error => {
            console.error(error)
          })
      },

      // get the total number of traffic logs from a mesh
      getTrafficLogsFromMeshTotalCount ({ commit }, mesh) {
        return api.getAllTrafficLogsFromMesh(mesh)
          .then(response => {
            const total = response.items.length

            commit('SET_TOTAL_TRAFFIC_LOGS_COUNT_FROM_MESH', total)
          })
          .catch(error => {
            console.error(error)
          })
      },

      // get the total number of traffic traces from a mesh
      getTrafficTracesFromMeshTotalCount ({ commit }, mesh) {
        return api.getAllTrafficTracesFromMesh(mesh)
          .then(response => {
            const total = response.items.length

            commit('SET_TOTAL_TRAFFIC_TRACES_COUNT_FROM_MESH', total)
          })
          .catch(error => {
            console.error(error)
          })
      },

      // get the total number of fault injections from a mesh
      getFaultInjectionsFromMeshTotalCount ({ commit }, mesh) {
        return api.getAllFaultInjectionsFromMesh(mesh)
          .then(response => {
            const total = response.items.length

            commit('SET_TOTAL_FAULT_INJECTIONS_COUNT_FROM_MESH', total)
          })
          .catch(error => {
            console.error(error)
          })
      },

      // get the total number of health checks from a mesh
      getHealthChecksFromMeshTotalCount ({ commit }, mesh) {
        return api.getAllHealthChecksFromMesh(mesh)
          .then(response => {
            const total = response.items.length

            commit('SET_TOTAL_HEALTH_CHECKS_COUNT_FROM_MESH', total)
          })
          .catch(error => {
            console.error(error)
          })
      },

      // get the total proxy templates from a mesh
      getProxyTemplatesFromMeshTotalCount ({ commit }, mesh) {
        return api.getAllProxyTemplatesFromMesh(mesh)
          .then(response => {
            const total = response.items.length

            commit('SET_TOTAL_PROXY_TEMPLATE_COUNT_FROM_MESH', total)
          })
          .catch(error => {
            console.error(error)
          })
      },

      // get the current version
      getVersion ({ commit }) {
        return api.getInfo()
          .then(response => {
            commit('SET_VERSION', response.version)
          })
          .catch(error => {
            console.error(error)
          })
      },

      // get the current tagline
      getTagline ({ commit }) {
        return api.getInfo()
          .then(response => {
            commit('SET_TAGLINE', response.tagline)
          })
          .catch(error => {
            console.error(error)
          })
      },

      // get the status of the API
      getStatus ({ commit }) {
        return api.getStatus()
          .then(response => {
            commit('SET_STATUS', response)
          })
      },

      // get the general Kuma config (this differs from the API config endpoint)
      getConfig ({ commit }) {
        return api.getConfig()
          .then(response => {
            commit('SET_CONFIG_DATA', response)
          })
      },

      // allows us to set the selected tab outside of the Tabs component
      updateSelectedTab ({ commit }, tab) {
        commit('SET_NEW_TAB', tab)
      },

      updateSelectedTableRow ({ commit }, row) {
        commit('SET_NEW_TABLE_ROW', row)
      },

      // set the user's environment (this is discovered upon app launch)
      updateEnvironment ({ commit }, value) {
        commit('SET_ENVIRONMENT', value)
      },

      // update the stored Wizard data for use in generating code output
      updateWizardData ({ commit }, value) {
        commit('SET_WIZARD_DATA', value)
      }
    }
  })

  return store
}
