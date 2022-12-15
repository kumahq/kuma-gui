import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import UpgradeCheck from './UpgradeCheck.vue'

function renderComponent() {
  return mount(UpgradeCheck)
}

describe('UpgradeCheck.vue', () => {
  test('renders snapshot', async () => {
    const wrapper = renderComponent()

    await flushPromises()
    expect(wrapper.html()).toContain('Update')

    expect(wrapper.element).toMatchSnapshot()
  })
})
