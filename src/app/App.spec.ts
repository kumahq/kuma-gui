import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'
import { withVersion } from '@/../jest/jest-setup-after-env'

import App from './App.vue'
import { TOKENS } from '@/components'
import { set } from '@/services'
import { useStore, useEnv } from '@/utilities'

const store = useStore()

function renderComponent(status: string) {
  const env = useEnv()
  store.state.globalLoading = true
  store.state.config.tagline = env('KUMA_PRODUCT_NAME')
  store.state.config.status = status

  // keeps the github-button as a <github-button> instead of a span in
  // the snapshot so its as close to actual usage as possible
  set(TOKENS.GithubButton, () => ({
    template: '<github-button />',
    compilerOptions: {
      isCustomElement: () => true,
    },
  }))
  return mount(App, {
    global: {
      stubs: {
        // Let’s not unnecessarily render all that chart markup.
        DonutChart: true,
      },
    },
  })
}

describe('App.vue', () => {
  test('renders main view when successful', async () => {
    withVersion('10.2.0')
    const wrapper = renderComponent('OK')
    store.dispatch('bootstrap')

    expect(wrapper.find('[data-testid="app-progress-bar"]').exists()).toBe(true)
    await flushPromises()
    expect(wrapper.find('[data-testid="app-progress-bar"]').exists()).toBe(false)

    expect(wrapper.html()).toContain('Create a virtual mesh')
  })

  test('fails to renders basic view', async () => {
    withVersion('10.2.0')
    const wrapper = renderComponent('ERROR')
    store.dispatch('bootstrap')

    expect(wrapper.find('[data-testid="app-progress-bar"]').exists()).toBe(true)
    await flushPromises()
    expect(wrapper.find('[data-testid="app-progress-bar"]').exists()).toBe(false)

    expect(wrapper.element).toMatchSnapshot()
  })
})
