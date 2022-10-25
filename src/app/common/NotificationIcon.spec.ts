import { mount } from '@vue/test-utils'

import NotificationIcon from './NotificationIcon.vue'
import { store, storeKey } from '@/store/store'

function renderComponent() {
  return mount(NotificationIcon, {
    global: {
      plugins: [[store, storeKey]],
    },
  })
}

describe('NotificationIcon.vue', () => {
  it('renders snapshot', async () => {
    const wrapper = renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders icon without notification number', async () => {
    const wrapper = renderComponent()

    expect(wrapper.find('[data-testid="notification-amount"]').exists()).toBe(false)
  })
})
