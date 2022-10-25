import { mount } from '@vue/test-utils'

import { store, storeKey } from '@/store/store'
import MetricsNotification from './MetricsNotification.vue'

describe('MetricsNotification.vue', () => {
  it('renders snapshot', () => {
    const wrapper = mount(MetricsNotification, {
      global: {
        plugins: [[store, storeKey]],
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })
})
