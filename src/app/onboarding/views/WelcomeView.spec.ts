import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import WelcomeView from './WelcomeView.vue'
import { useMock } from '@/../jest/jest-setup-after-env'
import { useStore } from '@/utilities'

function renderComponent() {
  return mount(WelcomeView)
}

describe('WelcomeView.vue', () => {
  const mock = useMock()
  const store = useStore()
  test('renders snapshot', async () => {
    mock('/config', {}, (merge) => {
      return merge({
        body: {
          environment: 'universal',
          mode: 'standalone',
        },
      })
    })
    await store.dispatch('bootstrap')
    const wrapper = renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders Kubernetes', async () => {
    mock('/config', {}, (merge) => {
      return merge({
        body: {
          environment: 'kubernetes',
        },
      })
    })
    await store.dispatch('bootstrap')
    const wrapper = renderComponent()

    expect(wrapper.html()).toContain('Kubernetes')
  })
})
