import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import DataplanesOverview from './DataplanesOverview.vue'
import { useMock } from '@/../jest/jest-setup-after-env'

function renderComponent() {
  return mount(DataplanesOverview)
}

describe('DataplanesOverview.vue', () => {
  const mock = useMock()
  test('renders snapshot', async () => {
    mock('/dataplanes', { env: { KUMA_DATAPLANE_COUNT: '1' } }, (merge) => {
      return merge({
        body: {
          items: [
            {
              name: 'dataplane-test-456',
            },
          ],
        },
      })
    })
    mock('/meshes/:mesh/dataplanes+insights/:name', { env: { KUMA_SUBSCRIPTION_COUNT: '1' } }, (merge) => {
      return merge({
        body: {
          name: 'dataplane-test-456',
          dataplaneInsight: {
            subscriptions: [
              {
                connectTime: '2021-02-17T07:33:36.412683Z',
                disconnectTime: '',
              },
            ],
          },
        },
      })
    })
    const wrapper = renderComponent()

    expect(wrapper.find('[data-testid="loading"]').exists()).toBe(true)
    expect(wrapper.find('h1').html()).toContain('Waiting for DPPs')
    expect(wrapper.find('[data-testid="onboarding-next-button"]').attributes('disabled')).toBe('true')

    await flushPromises()
    expect(wrapper.html()).toContain('dataplane-test-456')

    expect(wrapper.element).toMatchSnapshot()
  })
})
