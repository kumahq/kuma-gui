import { mount } from '@vue/test-utils'

import { store, storeKey } from '@/store/store'
import AppOnboardingNotification from './AppOnboardingNotification.vue'

describe('AppOnboardingNotification', () => {
  it('renders snapshot', () => {
    const wrapper = mount(AppOnboardingNotification, {
      global: {
        plugins: [[store, storeKey]],
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })
})
