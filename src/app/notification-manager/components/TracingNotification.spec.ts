import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import TracingNotification from './TracingNotification.vue'

describe('TracingNotification.vue', () => {
  test('renders snapshot', () => {
    const wrapper = mount(TracingNotification)

    expect(wrapper.element).toMatchSnapshot()
  })
})
