import { mount } from '@vue/test-utils'

import MetricsNotification from './MetricsNotification.vue'

describe('MetricsNotification.vue', () => {
  it('renders snapshot', () => {
    const wrapper = mount(MetricsNotification)

    expect(wrapper.element).toMatchSnapshot()
  })
})
