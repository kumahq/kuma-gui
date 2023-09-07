import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import CreateMesh from './CreateMesh.vue'

import { useMock } from '@/../jest/jest-setup-after-env'

function renderComponent() {
  return mount(CreateMesh)
}

describe('CreateMesh.vue', () => {
  const mock = useMock()
  test('renders snapshot', async () => {
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders multizone next step', async () => {
    mock('/config', {}, (merge) => {
      return merge({
        body: {
          mode: 'global',
        },
      })
    })
    const wrapper = renderComponent()

    expect(wrapper.html()).toContain('/onboarding/multi-zone')
  })
})
