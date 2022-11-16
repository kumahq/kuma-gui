import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import MtlsNotification from './MtlsNotification.vue'

describe('MtlsNotification.vue', () => {
  test('renders snapshot', () => {
    const wrapper = mount(MtlsNotification)

    expect(wrapper.element).toMatchSnapshot()
  })
})
