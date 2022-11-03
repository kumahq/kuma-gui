import { mount } from '@vue/test-utils'

import LoggingNotification from './LoggingNotification.vue'

describe('LoggingNotification.vue', () => {
  it('renders snapshot', () => {
    const wrapper = mount(LoggingNotification)

    expect(wrapper.element).toMatchSnapshot()
  })
})
