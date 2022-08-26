import { createStore } from 'vuex'
import { flushPromises, mount } from '@vue/test-utils'
import { KAlert, KButton, KCard, KClipboardProvider, KEmptyState, KIcon, KPop, KTable, KTabs } from '@kong/kongponents'

import PolicyView from './PolicyView.vue'
import { storeConfig } from '@/store/index'

async function createWrapper(props = {}) {
  const store = createStore(storeConfig)

  await store.dispatch('fetchPolicies')

  return mount(PolicyView, {
    props,
    global: {
      plugins: [store],
      components: { KAlert, KButton, KCard, KClipboardProvider, KEmptyState, KIcon, KPop, KTable, KTabs },
      mocks: {
        $route: {
          query: {},
          params: {},
        },
      },
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
