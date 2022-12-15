import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import UpgradeCheck from './UpgradeCheck.vue'
import container from '@/services/container'

function renderComponent() {
  return mount(UpgradeCheck)
}

describe('UpgradeCheck.vue', () => {
  test('renders snapshot', async () => {
    const env = container.get('env')
    container.set('env', {
      var: (key: string) => {
        if (key === 'KUMA_VERSION') {
          return '1.2.0'
        }
        return env.var(key)
      },
    })
    const wrapper = renderComponent()

    await flushPromises()
    expect(wrapper.html()).toContain('Update')

    expect(wrapper.element).toMatchSnapshot()
  })
})
