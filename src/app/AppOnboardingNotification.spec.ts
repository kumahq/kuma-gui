import { mount } from '@vue/test-utils'

import AppOnboardingNotification from './AppOnboardingNotification.vue'

describe('AppOnboardingNotification', () => {
  it('renders snapshot', () => {
    const wrapper = mount(AppOnboardingNotification)

    expect(wrapper.element).toMatchSnapshot()
  })
})
