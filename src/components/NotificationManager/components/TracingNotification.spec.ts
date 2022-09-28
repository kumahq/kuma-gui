import { mount } from '@vue/test-utils'

import { store, storeKey } from '@/store/store'
import TracingNotification from './TracingNotification.vue'

describe('TracingNotification.vue', () => {
  it('renders snapshot', () => {
    const wrapper = mount(TracingNotification, {
      global: {
        plugins: [[store, storeKey]],
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })
})
