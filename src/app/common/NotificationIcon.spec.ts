import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import NotificationIcon from './NotificationIcon.vue'

function renderComponent() {
  return mount(NotificationIcon)
}

describe('NotificationIcon.vue', () => {
  test('renders snapshot', async () => {
    const wrapper = renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders icon without notification number', async () => {
    const wrapper = renderComponent()

    expect(wrapper.find('[data-testid="notification-amount"]').exists()).toBe(false)
  })
})
