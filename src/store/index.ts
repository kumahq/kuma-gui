import { StoreOptions } from 'vuex'

import { ConfigInterface } from './modules/config/config.types'
import { NotificationsInterface } from './modules/notifications/notifications.types'
import { OnboardingInterface } from './modules/onboarding/onboarding.types'
import { SidebarInterface } from './modules/sidebar/sidebar.types'
import { getItemStatusFromInsight } from '@/dataplane'
import { ONLINE, OFFLINE, PARTIALLY_DEGRADED, PAGE_REQUEST_SIZE_DEFAULT } from '@/consts'
import config from '@/store/modules/config/config'
import notifications from '@/store/modules/notifications/notifications'
import onboarding from '@/store/modules/onboarding/onboarding'
import sidebar from '@/store/modules/sidebar/sidebar'

import { fetchAllResources } from '@/helpers'
import { getEmptyInsight, mergeInsightsReducer, parseInsightReducer } from '@/store/reducers/mesh-insights'
import Kuma from '@/services/kuma'
import { Mesh, Policy, ResourceResponse } from '@/types'

type TODO = any

const initialState = {
  menu: null,
  globalLoading: true,
  meshes: {
    total: 0,
    items: [],
    next: null,
  } as ResourceResponse<Mesh>,
  selectedMesh: 'all', // shows all meshes on initial load
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
  } as Record<string, { data: any[] }>,
  meshInsight: getEmptyInsight(),
  meshInsightsFetching: false,
  serviceInsightsFetching: false,
  externalServicesFetching: false,
  zonesInsightsFetching: false,
  policies: [] as Policy[],
  policiesByPath: {},
  policiesByType: {},
}

export type State = typeof initialState & {
  /**
   * Explicitly adds the types for all modules here
   * because the created store for some reason doesn’t have module types at all.
   */
  config?: ConfigInterface
  sidebar?: SidebarInterface
  notifications?: NotificationsInterface
  onboarding?: OnboardingInterface
}

export const storeConfig: StoreOptions<State> = {
  modules: {
    sidebar,
    config,
    notifications,
    onboarding,
  },
  state: initialState,
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
    SET_MESHES: (state, meshes) => (state.meshes = meshes),
    SET_SELECTED_MESH: (state, mesh) => (state.selectedMesh = mesh),
    SET_TOTAL_DATAPLANE_COUNT: (state, count) => (state.totalDataplaneCount = count),
    SET_TOTAL_CLUSTER_COUNT: (state, count) => (state.totalClusters = count),

    // NEW
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
    // bootstrap app

    async bootstrap({ commit, dispatch, getters }) {
      // check the Kuma status before we do anything else
      await dispatch('config/getStatus')

      // only dispatch these actions if the Kuma is online
      if (getters['config/getStatus'] === 'OK') {
        // get mesh from localStorage or default one from vuex
        const mesh = localStorage.getItem('selectedMesh')

        if (mesh) {
          dispatch('updateSelectedMesh', mesh)
        } else {
          dispatch('updateSelectedMesh', 'all')
        }

        // fetch the mesh list
        const meshPromise = dispatch('fetchMeshList')
        // fetch the dataplanes
        const dataplanePromise = dispatch('fetchDataplaneTotalCount')
        // bootstrap config data
        const configPromise = dispatch('config/bootstrapConfig')

        const sidebarInsightsPromise = dispatch('sidebar/getInsights')

        await Promise.all([meshPromise, dataplanePromise, configPromise, sidebarInsightsPromise])
      }

      commit('SET_GLOBAL_LOADING', { globalLoading: false })
    },

    // fetch all of the meshes from the Kuma
    fetchMeshList({ commit }) {
      const params = {
        size: PAGE_REQUEST_SIZE_DEFAULT,
      }

      return Kuma.getAllMeshes(params)
        .then(response => {
          commit('SET_MESHES', response)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // update the selected mesh
    updateSelectedMesh({ commit }, mesh) {
      localStorage.setItem('selectedMesh', mesh)
      commit('SET_SELECTED_MESH', mesh)
    },

    /**
     * Total Counts (for all items)
     */

    // get total clusters (Zones) when in multicluster (or "Multi-Zone") mode
    fetchTotalClusterCount({ commit }) {
      return Kuma.getZones().then(response => {
        const total = response.total

        commit('SET_TOTAL_CLUSTER_COUNT', total)
      })
    },

    // get the total number of dataplanes present
    fetchDataplaneTotalCount({ commit }) {
      const params = { size: 1 }

      return Kuma.getAllDataplanes(params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_DATAPLANE_COUNT', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // NEW

    async fetchMeshInsights({ commit, dispatch }, mesh = 'all') {
      commit('SET_MESH_INSIGHTS_FETCHING', true)

      try {
        if (mesh === 'all') {
          const params = {
            callEndpoint: Kuma.getAllMeshInsights.bind(Kuma),
          }

          commit('SET_MESH_INSIGHT_FROM_ALL_MESHES', await fetchAllResources(params))
        } else {
          commit('SET_MESH_INSIGHT', await Kuma.getMeshInsights({ name: mesh }))
        }
      } catch (e) {
        commit('SET_MESH_INSIGHT', getEmptyInsight())
      } finally {
        dispatch('setChartsFromMeshInsights')
      }

      commit('SET_MESH_INSIGHTS_FETCHING', false)
    },

    async fetchServiceInsights({ commit }, mesh = 'all') {
      commit('SET_SERVICE_INSIGHTS_FETCHING', true)

      try {
        const params = {
          callEndpoint:
            mesh === 'all'
              ? Kuma.getAllServiceInsights.bind(Kuma)
              : Kuma.getAllServiceInsightsFromMesh.bind(Kuma, { mesh }),
        }

        commit('SET_INTERNAL_SERVICE_SUMMARY', await fetchAllResources(params))
      } catch (e) {
        commit('SET_INTERNAL_SERVICE_SUMMARY')
      }

      commit('SET_SERVICE_INSIGHTS_FETCHING', false)
    },

    async fetchExternalServices({ commit }, mesh = 'all') {
      commit('SET_EXTERNAL_SERVICES_FETCHING', true)

      try {
        const params = {
          callEndpoint:
            mesh === 'all'
              ? Kuma.getAllExternalServices.bind(Kuma)
              : Kuma.getAllExternalServicesFromMesh.bind(Kuma, { mesh }),
        }

        commit('SET_EXTERNAL_SERVICE_SUMMARY', await fetchAllResources(params))
      } catch (e) {
        commit('SET_EXTERNAL_SERVICE_SUMMARY')
      }

      commit('SET_EXTERNAL_SERVICES_FETCHING', false)
    },

    async fetchServices({ dispatch }, mesh = 'all') {
      const externalServices = dispatch('fetchExternalServices', mesh)
      const serviceInsights = dispatch('fetchServiceInsights', mesh)

      await Promise.all([serviceInsights, externalServices])
      await dispatch('setOverviewServicesChartData')
    },

    async fetchZonesInsights({ commit, dispatch, getters }, multicluster = false) {
      commit('SET_ZONES_INSIGHTS_FETCHING', true)

      try {
        if (multicluster) {
          const params = {
            callEndpoint: Kuma.getAllZoneOverviews.bind(Kuma),
          }

          const data = await fetchAllResources(params)

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
      } catch (e) {
        commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zones', data: [] })
        commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zonesCPVersions', data: [] })
      }

      commit('SET_ZONES_INSIGHTS_FETCHING', false)
    },

    async fetchPolicies({ commit }) {
      const { policies } = await Kuma.getPolicies()
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
        const { status } = getItemStatusFromInsight(item.zoneInsight)

        if (status === ONLINE) {
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
      const total = state.meshInsight.dataplanes.total
      const online = state.meshInsight.dataplanes.online
      const partiallyDegraded = state.meshInsight.dataplanes.partiallyDegraded || 0

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
