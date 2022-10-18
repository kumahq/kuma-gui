import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { State } from '../../index'
import { OnboardingInterface } from './onboarding.types'
import { ClientStorage } from '@/utils/ClientStorage'

const initialOnboardingState: OnboardingInterface = {
  isCompleted: ClientStorage.get('onboardingIsCompleted') === 'true',
  step: ClientStorage.get('onboardingStep') || 'onboarding-welcome',
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
    const hasOnlyDefaultMesh = rootState.meshes.items.length === 1 && rootState.meshes.items[0].name === 'default'

    return rootState.totalDataplaneCount === 0 && hasOnlyDefaultMesh
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
    ClientStorage.set('onboardingIsCompleted', 'true')
    ClientStorage.remove('onboardingStep')
  },

  // change step in onboarding
  changeStep({ commit }, step) {
    commit('SET_STEP', step)
    ClientStorage.set('onboardingStep', step)
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
