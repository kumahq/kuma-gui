import { createLocalVue } from '@vue/test-utils'
import Vuex, { Module } from 'vuex'

export default function setupStore(mockedModule: Module<any, any>, state = {}) {
  const localVue = createLocalVue()

  localVue.use(Vuex)

  return new Vuex.Store({ ...mockedModule, state: { ...mockedModule.state, ...(state as any) } })
}
