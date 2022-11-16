import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import DeploymentTypes from './DeploymentTypes.vue'

function renderComponent() {
  return mount(DeploymentTypes, {
  })
}

describe('DeploymentTypes.vue', () => {
  test('renders snapshot', () => {
    const wrapper = renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('changes selected graph', async () => {
    const wrapper = renderComponent()

    const multiZoneRadioButton = wrapper.find('[data-testid="onboarding-multi-zone-radio-button"]')
    await multiZoneRadioButton.trigger('click')

    expect(wrapper.find('[data-testid="multizone-graph"]').exists()).toBe(true)
  })
})
