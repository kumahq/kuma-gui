import { mount } from '@vue/test-utils'

import TracingNotification from './TracingNotification.vue'

describe('TracingNotification.vue', () => {
  it('renders snapshot', () => {
    const wrapper = mount(TracingNotification)

    expect(wrapper.element).toMatchSnapshot()
  })
})
