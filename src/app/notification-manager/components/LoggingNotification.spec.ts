import { mount } from '@vue/test-utils'

import { store, storeKey } from '@/store/store'
import LoggingNotification from './LoggingNotification.vue'

describe('LoggingNotification.vue', () => {
  it('renders snapshot', () => {
    const wrapper = mount(LoggingNotification, {
      global: {
        plugins: [[store, storeKey]],
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })
})
