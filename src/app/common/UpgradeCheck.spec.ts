import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import UpgradeCheck from './UpgradeCheck.vue'
import { store } from '@/store/store'

describe('UpgradeCheck.vue', () => {
  test('renders snapshot', async () => {
    store.state.config.tagline = import.meta.env.VITE_NAMESPACE

    const wrapper = mount(UpgradeCheck)

    await flushPromises()
    expect(wrapper.html()).toContain('Update')

    expect(wrapper.element).toMatchSnapshot()
  })
})
