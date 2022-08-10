import VueRouter from 'vue-router'
import Vuex from 'vuex'
import { createLocalVue, mount } from '@vue/test-utils'

import PolicyView from './PolicyView.vue'
import Store from '@/store/index'

const localVue = createLocalVue()

localVue.use(VueRouter)
localVue.use(Vuex)

const router = new VueRouter()

async function createWrapper(props = {}) {
  const store = new Vuex.Store(Store())

  await store.dispatch('fetchPolicies')

  return mount(PolicyView, {
    localVue,
    router,
    store,
    propsData: props,
  })
}

describe('PolicyView', () => {
  test('renders default view correctly', async () => {
    const wrapper = await createWrapper({ policyPath: 'circuit-breakers' })

    // For some magical reason, this exact arrangement is necessary to wait for the component to completely load. Yikes.
    // TODO: In @vue/test-utils@2, use `await flushPromises()` instead.
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 0))

    const documentationLink = wrapper.find('[data-testid="policy-documentation-link"]')

    expect(documentationLink.exists()).toBe(true)

    const singleEntity = wrapper.find('[data-testid="policy-single-entity"]')

    expect(singleEntity.html()).toContain('Circuit Breaker: cb1')

    const policyOverview = wrapper.find('[data-testid="policy-overview-tab"]')

    expect(policyOverview.html()).toContain('CircuitBreaker')
  })
})
