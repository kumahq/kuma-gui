import { flushPromises, mount } from '@vue/test-utils'

import PolicyView from './PolicyView.vue'
import { store, storeKey } from '@/store/store'
import { router } from '@/../jest/jest-setup-after-env'

async function createWrapper(props = {}) {
  router.currentRoute.value.name = 'home'
  router.currentRoute.value.params.mesh = 'default'
  await store.dispatch('fetchPolicies')

  return mount(PolicyView, {
    props,
    global: {
      plugins: [[store, storeKey]],
    },
  })
}

describe('PolicyView', () => {
  test('renders default view correctly', async () => {
    const wrapper = await createWrapper({ policyPath: 'circuit-breakers' })

    await flushPromises()

    const documentationLink = wrapper.find('[data-testid="policy-documentation-link"]')

    expect(documentationLink.exists()).toBe(true)

    const singleEntity = wrapper.find('[data-testid="policy-single-entity"]')

    expect(singleEntity.html()).toContain('Circuit Breaker: cb1')

    const policyOverview = wrapper.find('[data-testid="policy-overview-tab"]')

    expect(policyOverview.html()).toContain('CircuitBreaker')
  })
})
