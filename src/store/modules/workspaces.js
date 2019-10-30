const state = {
  workspace: null,
  workspaces: []
}

const getters = {
  getWorkspace (state) {
    return state.workspace
  },
  getWorkspaces (state) {
    return state.workspaces
  },
  getWorkspaceConfig (state) {
    const currentWs = state.workspaces.find(ws => {
      return ws.name === state.workspace
    })

    return currentWs ? currentWs.config : {}
  },
  getWorkspaceConfigValue: (state, getters) => (parameter) => {
    return getters.getWorkspaceConfig[parameter]
  }

}

const mutations = {
  setWorkspace (state, workspace) {
    state.workspace = workspace
  },

  setWorkspaces (state, workspaces) {
    state.workspaces = workspaces
  },

  setWorkspaceConfig (state, config) {
    state.workspaces = state.workspaces.map(ws => {
      if (ws.name === state.workspace) {
        ws = { ...ws, config }
      }

      return ws
    })
  }
}

const actions = {
  setWorkspaces ({ commit }, workspaces) {
    commit('setWorkspaces', workspaces)
  },

  setWorkspaceConfig ({ commit }, config) {
    commit('setWorkspaceConfig', config)
  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
