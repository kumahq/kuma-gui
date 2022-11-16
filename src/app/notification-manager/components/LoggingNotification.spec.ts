import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import LoggingNotification from './LoggingNotification.vue'

describe('LoggingNotification.vue', () => {
  test('renders snapshot', () => {
    const wrapper = mount(LoggingNotification)

    expect(wrapper.element).toMatchSnapshot()
  })
})
