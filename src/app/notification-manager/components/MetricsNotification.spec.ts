import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import MetricsNotification from './MetricsNotification.vue'

describe('MetricsNotification.vue', () => {
  test('renders snapshot', () => {
    const wrapper = mount(MetricsNotification)

    expect(wrapper.element).toMatchSnapshot()
  })
})
