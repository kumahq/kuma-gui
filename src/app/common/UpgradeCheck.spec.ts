import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'
import { withVersion } from '@/../jest/jest-setup-after-env'

import UpgradeCheck from './UpgradeCheck.vue'

function renderComponent() {
  return mount(UpgradeCheck)
}

describe('UpgradeCheck.vue', () => {
  test('renders snapshot', async () => {
    withVersion('1.2.0')

    const wrapper = renderComponent()

    await flushPromises()
    expect(wrapper.html()).toContain('Update')

    expect(wrapper.element).toMatchSnapshot()
  })
})
