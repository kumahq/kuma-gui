import { ActionTree, GetterTree, MutationTree } from 'vuex'

import { NotificationsInterface, NotificationItem, MeshNotificationItem } from './notifications.types'
import { State } from '../../storeConfig'
import { Mesh } from '@/types/index.d'

const initialNotificationsState: NotificationsInterface = {
  isOpen: false,
}

const mutations: MutationTree<NotificationsInterface> = {
  OPEN_MODAL: state => (state.isOpen = true),
  CLOSE_MODAL: state => (state.isOpen = false),
}

const getters: GetterTree<NotificationsInterface, State> = {
  meshNotificationItemMap(_state, _getters, rootState) {
    const meshList = rootState.meshes?.items || []

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

  meshNotificationItemMapWithAction(_state, getters) {
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

  singleMeshNotificationItems(_state, getters, rootState, rootGetters): NotificationItem[] {
    if (rootState.selectedMesh === null || !(rootState.selectedMesh in getters.meshNotificationItemMap)) {
      return []
    }

    const meshItem: MeshNotificationItem = getters.meshNotificationItemMap[rootState.selectedMesh]

    // if MeshAccessLog or MeshTrace are > 0 then we have logging
    // totals default to zero via the frontend
    const hasPolicyBasedLogging = Object.entries(rootGetters.getMeshInsight.policies as {total: number}[])
      .filter(([key, _item]) => ['MeshAccessLog', 'MeshTrace'].includes(key))
      .some(([_key, item]) => item.total > 0)

    const items: NotificationItem[] = [
      {
        name: 'Observability, Metrics & Service Map',
        component: 'MetricsNotification',
        isCompleted: meshItem.hasMetrics,
      },
      {
        name: 'Logging',
        component: 'LoggingNotification',
        isCompleted: meshItem.hasLogging || hasPolicyBasedLogging,
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

  amountOfActions(_state, getters) {
    return Object.keys(getters.meshNotificationItemMapWithAction).length
  },
}

const actions: ActionTree<NotificationsInterface, State> = {
  openModal({ commit }) {
    commit('OPEN_MODAL')
  },

  closeModal({ commit }) {
    commit('CLOSE_MODAL')
  },
}

const notificationsModule = {
  namespaced: true,
  state: () => initialNotificationsState,
  getters,
  mutations,
  actions,
}

export default notificationsModule
