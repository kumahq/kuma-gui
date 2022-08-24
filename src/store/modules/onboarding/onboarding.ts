import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { State } from '../../index'
import { OnboardingInterface } from './onboarding.types'

const initialOnboardingState: OnboardingInterface = {
  isCompleted: localStorage.getItem('onboarding/isCompleted') === 'true',
  step: localStorage.getItem('onboarding/step') || 'onboarding-welcome',
  mode: 'demo',
}

const mutations: MutationTree<OnboardingInterface> = {
  SET_STEP: (state, step) => (state.step = step),
  SET_IS_COMPLETED: (state, isCompleted) => (state.isCompleted = isCompleted),
  UPDATE_MODE: (state, message) => (state.mode = message),
}

const getters: GetterTree<OnboardingInterface, State> = {
  getMode: state => state.mode,
  showOnboarding: (_state, _getters, rootState) => {
    const onlyDefaultMesh = rootState.meshes.items.length === 1 && rootState.meshes.items[0].name === 'default'
    const noDataplane = rootState.totalDataplaneCount === 0

    return noDataplane && onlyDefaultMesh
  },
}

const actions: ActionTree<OnboardingInterface, State> = {
  // complete/skip onboarding
  completeOnboarding({ commit, dispatch }) {
    // fetch the dataplanes
    dispatch('fetchDataplaneTotalCount', null, { root: true })

    // fetch sidebar insights
    dispatch('sidebar/getInsights', null, { root: true })

    commit('SET_IS_COMPLETED', true)
    localStorage.setItem('onboarding/isCompleted', 'true')
  },

  // change step in onboarding
  changeStep({ commit }, step) {
    commit('SET_STEP', step)
    localStorage.setItem('onboarding/step', step)
  },
}

const onboardingModule = {
  namespaced: true,
  state: initialOnboardingState,
  getters,
  mutations,
  actions,
}

export default onboardingModule
