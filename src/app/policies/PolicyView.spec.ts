import { createRouter, createWebHashHistory } from 'vue-router'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { KAlert, KButton, KCard, KClipboardProvider, KEmptyState, KIcon, KPop, KTable, KTabs } from '@kong/kongponents'

import PolicyView from './PolicyView.vue'
import { store, storeKey } from '@/store/store'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: { template: 'TestComponent' },
    },
  ],
})

async function createWrapper(props = {}) {
  await store.dispatch('fetchPolicies')

  return mount(PolicyView, {
    props,
    global: {
      plugins: [router, [store, storeKey]],
      stubs: {
        'router-link': RouterLinkStub,
      },
      components: { KAlert, KButton, KCard, KClipboardProvider, KEmptyState, KIcon, KPop, KTable, KTabs },
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
