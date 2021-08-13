import { createLocalVue } from '@vue/test-utils'
import Vuex, { Module } from 'vuex'
import Kuma from '@/services/kuma'

export default function setupStore(module: (api: Kuma) => Module<any, any>, state = {}) {
  const localVue = createLocalVue()

  localVue.use(Vuex)

  const mockedModule = module(new Kuma())

  return new Vuex.Store({ ...mockedModule, state: { ...mockedModule.state, ...(state as any) } })
}
