import { mount } from '@vue/test-utils'

import { store, storeKey } from '@/store/store'
import OnboardingNotification from './OnboardingNotification.vue'

describe('OnboardingNotification.vue', () => {
  it('renders snapshot', () => {
    const wrapper = mount(OnboardingNotification, {
      global: {
        plugins: [[store, storeKey]],
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })
})
