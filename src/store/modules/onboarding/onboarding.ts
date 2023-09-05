import { ActionTree, MutationTree } from 'vuex'

import { OnboardingInterface } from './onboarding.types'
import { State } from '../../storeConfig'
import { ClientStorage } from '@/utilities/ClientStorage'

const initialOnboardingState: OnboardingInterface = {
  isCompleted: ClientStorage.get('onboardingIsCompleted') === 'true',
  step: ClientStorage.get('onboardingStep') || 'onboarding-welcome',
  mode: 'demo',
}

const mutations: MutationTree<OnboardingInterface> = {
  SET_STEP: (state, step: typeof state.step) => (state.step = step),
  SET_IS_COMPLETED: (state, isCompleted: typeof state.isCompleted) => (state.isCompleted = isCompleted),
  UPDATE_MODE: (state, mode: typeof state.mode) => (state.mode = mode),
}

const actions: ActionTree<OnboardingInterface, State> = {
  completeOnboarding({ commit }) {
    commit('SET_IS_COMPLETED', true)
    ClientStorage.set('onboardingIsCompleted', 'true')
    ClientStorage.remove('onboardingStep')
  },

  changeStep({ commit }, step) {
    commit('SET_STEP', step)
    ClientStorage.set('onboardingStep', step)
  },

  changeMode({ commit }, mode) {
    commit('UPDATE_MODE', mode)
  },
}

const onboardingModule = {
  namespaced: true,
  state: () => initialOnboardingState,
  mutations,
  actions,
}

export default onboardingModule
