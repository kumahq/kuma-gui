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
    mock('/dataplanes', {}, (merge) => {
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
    const wrapper = renderComponent()

    expect(wrapper.find('[data-testid="loading"]').exists()).toBe(true)
    expect(wrapper.find('h1').html()).toContain('Waiting for DPPs')
    expect(wrapper.find('[data-testid="onboarding-next-button"]').attributes('disabled')).toBe('true')

    await flushPromises()
    expect(wrapper.html()).toContain('dataplane-test-456')

    expect(wrapper.element).toMatchSnapshot()
  })
})
