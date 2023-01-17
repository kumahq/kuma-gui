import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'
import { container, TOKENS, service, injected } from '@/services'
import Env from '@/services/env/Env'

import UpgradeCheck from './UpgradeCheck.vue'

function renderComponent() {
  return mount(UpgradeCheck)
}

describe('UpgradeCheck.vue', () => {
  test('renders snapshot', async () => {
    container.capture?.()

    class TestEnv extends Env {
      var(...rest: Parameters<Env['var']>) {
        const key = rest[0]
        if (key === 'KUMA_VERSION') {
          return '1.2.0'
        }
        return super.var(...rest)
      }
    }
    TOKENS.Env = service(TestEnv, { description: 'Env' })
    injected(TestEnv, TOKENS.EnvVars)

    const wrapper = renderComponent()

    await flushPromises()
    expect(wrapper.html()).toContain('Update')

    expect(wrapper.element).toMatchSnapshot()
    container.restore?.()
  })
})
