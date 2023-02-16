import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import WelcomeView from './WelcomeView.vue'
import { useStore } from '@/utilities'
import { ClientConfigInterface } from '@/store/modules/config/config.types'
import * as config from '@/api/mock-data/config.json'

const store = useStore()
function renderComponent(environment: string) {
  const clientConfig: ClientConfigInterface = { ...config, environment }
  store.state.config.clientConfig = clientConfig

  return mount(WelcomeView)
}

describe('WelcomeView.vue', () => {
  test('renders snapshot', () => {
    const wrapper = renderComponent('universal')

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders Kubernetess', () => {
    const wrapper = renderComponent('kubernetess')

    expect(wrapper.html()).toContain('Kubernetes')
  })
})
