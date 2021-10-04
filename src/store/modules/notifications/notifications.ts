import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { Mesh } from '@/types'
import { RootInterface } from '../..'
import { NotificationsInterface, NotificationItem } from './notifications.types'

const state: NotificationsInterface = {
  isOpen: false,
}

const mutations: MutationTree<NotificationsInterface> = {
  OPEN_MODAL: state => (state.isOpen = true),
  CLOSE_MODAL: state => (state.isOpen = false),
}

const getters: GetterTree<NotificationsInterface, RootInterface> = {
  hasLogging(state, getters, rootState, rootGetters) {
    return rootGetters.getMeshList.items?.some((mesh: Mesh) => Boolean(mesh.logging))
  },
  hasMtls(state, getters, rootState, rootGetters) {
    return rootGetters.getMeshList.items?.some((mesh: Mesh) => Boolean(mesh.mtls))
  },
  hasMetrics(state, getters, rootState, rootGetters) {
    return rootGetters.getMeshList.items?.some((mesh: Mesh) => Boolean(mesh.metrics))
  },
  hasTracing(state, getters, rootState, rootGetters) {
    return rootGetters.getMeshList.items?.some((mesh: Mesh) => Boolean(mesh.tracing))
  },
  items(state, getters, rootState, rootGetters): NotificationItem[] {
    const items: NotificationItem[] = [
      {
        name: 'Logging',
        component: 'LoggingNotification',
        isCompleted: getters.hasLogging,
      },
      {
        name: 'Zero-trust security',
        component: 'MtlsNotification',
        isCompleted: getters.hasMtls,
      },
      {
        name: 'Observability & Metrics',
        component: 'MetricsNotification',
        isCompleted: getters.hasMetrics,
      },
      {
        name: 'Tracing',
        component: 'TracingNotification',
        isCompleted: getters.hasTracing,
      },
    ]

    items.sort((itemX: NotificationItem, itemY: NotificationItem) => +itemX.isCompleted - +itemY.isCompleted)

    if (rootGetters.showOnboarding) {
      items.unshift({
        name: 'First Steps',
        component: 'OnboardingNotification',
        isCompleted: false,
      })
    }

    return items
  },

  amountOfActions(state, getters) {
    let amount = 0

    getters.items.forEach(({ isCompleted }: NotificationItem) => {
      if (!isCompleted) {
        amount++
      }
    })

    return amount
  },
}

const actions: ActionTree<NotificationsInterface, RootInterface> = {
  openModal({ commit }) {
    commit('OPEN_MODAL')
  },

  closeModal({ commit }) {
    commit('CLOSE_MODAL')
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
