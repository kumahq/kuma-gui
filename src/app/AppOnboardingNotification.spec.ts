import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import AppOnboardingNotification from './AppOnboardingNotification.vue'

describe('AppOnboardingNotification', () => {
  test('renders snapshot', () => {
    const wrapper = mount(AppOnboardingNotification)

    expect(wrapper.element).toMatchSnapshot()
  })
})
