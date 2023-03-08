import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import PolicyView from './PolicyView.vue'
import { router } from '@/../jest/jest-setup-after-env'
import { useStore } from '@/utilities'

const store = useStore()
async function createWrapper(props = {}) {
  await router.push({ name: 'mesh-detail-view', params: { mesh: 'default' } })
  await store.dispatch('fetchPolicyTypes')

  return mount(PolicyView, {
    props: {
      policyPath: 'circuit-breakers',
      ...props,
    },
  })
}

describe('PolicyView', () => {
  test('renders default view correctly', async () => {
    const wrapper = await createWrapper()

    await flushPromises()

    const documentationLink = wrapper.find('[data-testid="policy-documentation-link"]')
    expect(documentationLink.exists()).toBe(true)

    const singleEntity = wrapper.find('[data-testid="policy-single-entity"]')
    expect(singleEntity.html()).toContain('CircuitBreaker: cb1')

    const policyOverview = wrapper.find('[data-testid="policy-overview-tab"]')
    expect(policyOverview.html()).toContain('CircuitBreaker')
  })
})
