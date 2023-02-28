import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import CreateMesh from './CreateMesh.vue'
import { useStore } from '@/utilities'
import { ClientConfigInterface } from '@/store/modules/config/config.types'
import * as config from '@/api/mock-data/config.json'

const store = useStore()
function renderComponent(mode = 'standalone') {
  const clientConfig: ClientConfigInterface = { ...config, mode }
  store.state.config.clientConfig = clientConfig

  return mount(CreateMesh)
}

describe('CreateMesh.vue', () => {
  test('renders snapshot', async () => {
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders multizone next step', () => {
    const wrapper = renderComponent('global')

    expect(wrapper.html()).toContain('/onboarding/multi-zone')
  })
})
