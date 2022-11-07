import { mount } from '@vue/test-utils'

import MtlsNotification from './MtlsNotification.vue'

describe('MtlsNotification.vue', () => {
  it('renders snapshot', () => {
    const wrapper = mount(MtlsNotification)

    expect(wrapper.element).toMatchSnapshot()
  })
})
