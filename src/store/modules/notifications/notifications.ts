import { ActionTree, GetterTree, MutationTree } from 'vuex'

import { RootInterface } from '../..'
import { NotificationsInterface, NotificationItem, MeshNotificationItem } from './notifications.types'
import { Mesh } from '@/types'

const state: NotificationsInterface = {
  isOpen: false,
}

const mutations: MutationTree<NotificationsInterface> = {
  OPEN_MODAL: state => (state.isOpen = true),
  CLOSE_MODAL: state => (state.isOpen = false),
}

const getters: GetterTree<NotificationsInterface, RootInterface> = {
  meshNotificationItemMap(state, getters, rootState, rootGetters) {
    const meshList = rootGetters.getMeshList?.items || []

    const aggregatedList = meshList.reduce((meshAggregator: Record<string, MeshNotificationItem>, mesh: Mesh) => {
      meshAggregator[mesh.name] = {
        hasLogging: Boolean(mesh.logging),
        hasMtls: Boolean(mesh.mtls),
        hasMetrics: Boolean(mesh.metrics),
        hasTracing: Boolean(mesh.tracing),
      }

      return meshAggregator
    }, {})

    return aggregatedList
  },

  meshNotificationItemMapWithAction(state, getters, rootState, rootGetters) {
    const meshMap = getters.meshNotificationItemMap

    return Object.entries<MeshNotificationItem>(meshMap).reduce(
      (meshAggregator: Record<string, MeshNotificationItem>, [meshName, meshItem]: [string, MeshNotificationItem]) => {
        const hasAnyAction = Object.values(meshItem).some(actionState => !actionState)

        if (hasAnyAction) {
          meshAggregator[meshName] = meshItem
        }

        return meshAggregator
      },
      {},
    )
  },

  singleMeshNotificationItems(state, getters, rootState, rootGetters): NotificationItem[] {
    const selectedMesh = rootState.selectedMesh

    if (selectedMesh === 'all') {
      return []
    }

    const meshItem: MeshNotificationItem = getters.meshNotificationItemMap[selectedMesh]

    const items: NotificationItem[] = [
      {
        name: 'Observability, Metrics & Service Map',
        component: 'MetricsNotification',
        isCompleted: meshItem.hasMetrics,
      },
      {
        name: 'Logging',
        component: 'LoggingNotification',
        isCompleted: meshItem.hasLogging,
      },
      {
        name: 'Zero-trust security',
        component: 'MtlsNotification',
        isCompleted: meshItem.hasMtls,
      },
      {
        name: 'Tracing',
        component: 'TracingNotification',
        isCompleted: meshItem.hasTracing,
      },
    ]

    items.sort((itemX: NotificationItem, itemY: NotificationItem) => +itemX.isCompleted - +itemY.isCompleted)

    return items
  },

  amountOfActions(state, getters) {
    return Object.keys(getters.meshNotificationItemMapWithAction).length
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
