import { mount } from '@vue/test-utils'

import { store, storeKey } from '@/store/store'
import MtlsNotification from './MtlsNotification.vue'

describe('MtlsNotification.vue', () => {
  it('renders snapshot', () => {
    const wrapper = mount(MtlsNotification, {
      global: {
        plugins: [[store, storeKey]],
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })
})
