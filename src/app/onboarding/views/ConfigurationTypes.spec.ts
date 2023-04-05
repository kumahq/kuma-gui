import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import ConfigurationTypes from './ConfigurationTypes.vue'
import { useMock } from '@/../jest/jest-setup-after-env'
import { useStore } from '@/utilities'

function renderComponent() {
  return mount(ConfigurationTypes)
}

describe('ConfigurationTypes.vue', () => {
  const mock = useMock()
  const store = useStore()
  test('renders snapshot', () => {
    const wrapper = renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders multizone previous step', async () => {
    mock('/config', {}, (merge) => {
      return merge({
        body: {
          mode: 'global',
        },
      })
    })
    await store.dispatch('bootstrap')
    const wrapper = renderComponent()

    expect(wrapper.html()).toContain('/onboarding/multi-zone')
  })
})
