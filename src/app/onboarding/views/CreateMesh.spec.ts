import { flushPromises, mount } from '@vue/test-utils'

import CreateMesh from './CreateMesh.vue'
import { store } from '@/store/store'
import { ClientConfigInterface } from '@/store/modules/config/config.types'
import * as config from '@/api/mock-data/config.json'

function renderComponent(mode = 'standalone') {
  const clientConfig: ClientConfigInterface = { ...config, mode }
  store.state.config.clientConfig = clientConfig

  return mount(CreateMesh, {
    global: {
      stubs: {
        routerLink: {
          props: ['to'],
          template: '<a>{{ to.name }}</a>',
        },
      },
    },
  })
}

describe('CreateMesh.vue', () => {
  it('renders snapshot', async () => {
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders multizone next step', () => {
    const wrapper = renderComponent('global')

    expect(wrapper.html()).toContain('onboarding-multi-zone')
  })
})
