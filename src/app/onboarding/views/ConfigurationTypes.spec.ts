import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import ConfigurationTypes from './ConfigurationTypes.vue'
import { store } from '@/store/store'
import { ClientConfigInterface } from '@/store/modules/config/config.types'
import * as config from '@/api/mock-data/config.json'

function renderComponent(mode = 'standalone') {
  const clientConfig: ClientConfigInterface = { ...config, mode }
  store.state.config.clientConfig = clientConfig

  return mount(ConfigurationTypes, {
    global: {
      stubs: {
        'router-link': {
          props: ['to'],
          template: '<a>{{ to.name }}</a>',
        },
      },
    },
  })
}

describe('ConfigurationTypes.vue', () => {
  test('renders snapshot', () => {
    const wrapper = renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders multizone previous step', () => {
    const wrapper = renderComponent('global')

    expect(wrapper.html()).toContain('onboarding-multi-zone')
  })
})
