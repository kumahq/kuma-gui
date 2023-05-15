import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import PolicyListView from './PolicyListView.vue'
import { useMock } from '@/../jest/jest-setup-after-env'
import { useStore, useRouter } from '@/utilities'

const store = useStore()
async function createWrapper(props = {}) {
  const router = useRouter()
  await router.push({
    name: 'policy-detail-view',
    params: {
      mesh: 'default',
      policyPath: 'circuit-breakers',
      policy: 'foo',
    },
  })
  await store.dispatch('fetchPolicyTypes')

  return mount(PolicyListView, {
    props: {
      policyPath: 'circuit-breakers',
      ...props,
    },
  })
}

describe('PolicyListView', () => {
  const mock = useMock()
  test('renders default view correctly', async () => {
    const wrapper = await createWrapper()
    mock('/meshes/:mesh/circuit-breakers', {
      KUMA_CIRCUITBREAKER_COUNT: '1',
    }, (merge) => {
      return merge(
        {
          body: {
            items: [
              {
                name: 'cb1',
              },
            ],
          },
        },
      )
    })

    await flushPromises()

    const documentationLink = wrapper.find('[data-testid="policy-documentation-link"]')
    expect(documentationLink.exists()).toBe(true)

    const singleEntity = wrapper.find('[data-testid="policy-single-entity"]').html()
    expect(singleEntity).toContain('CircuitBreaker')
    expect(singleEntity).toContain('cb1')

    const policyOverview = wrapper.find('[data-testid="policy-detail-label-list"]')
    expect(policyOverview.html()).toContain('CircuitBreaker')
  })
})
