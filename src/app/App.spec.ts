import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import App from './App.vue'
import { withVersion, useMock } from '@/../jest/jest-setup-after-env'
import { TOKENS } from '@/components'
import { build } from '@/services'
import { useStore, useEnv } from '@/utilities'

const store = useStore()

function renderComponent() {
  const env = useEnv()
  store.state.globalLoading = true
  store.state.config.tagline = env('KUMA_PRODUCT_NAME')

  // keeps the github-button as a <github-button> instead of a span in
  // the snapshot so its as close to actual usage as possible
  build(
    [
      [TOKENS.GithubButton, {
        service: () => ({
          template: '<github-button />',
          compilerOptions: {
            isCustomElement: () => true,
          },
        }),
      }],
    ],
  )
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
  const mock = useMock()
  test('renders main view when successful', async () => {
    withVersion('10.2.0')
    const wrapper = renderComponent()

    await store.dispatch('updateGlobalLoading', true)
    store.dispatch('bootstrap')
    expect(wrapper.find('[data-testid="app-progress-bar"]').exists()).toBe(true)

    await flushPromises()
    await store.dispatch('updateGlobalLoading', false)
    expect(wrapper.find('[data-testid="app-progress-bar"]').exists()).toBe(false)

    expect(wrapper.html()).toContain('Create a virtual mesh')
  })

  test('fails to renders basic view', async () => {
    mock('/', {}, () => {
      return {
        headers: {
          'Status-Code': '500',
        },
        body: '',
      }
    })
    withVersion('10.2.0')
    await store.dispatch('updateGlobalLoading', true)
    await store.dispatch('bootstrap')
    const wrapper = renderComponent()

    expect(wrapper.find('[data-testid="app-progress-bar"]').exists()).toBe(true)

    await flushPromises()
    await store.dispatch('updateGlobalLoading', false)
    expect(wrapper.find('[data-testid="app-progress-bar"]').exists()).toBe(false)

    expect(wrapper.html()).toContain('Unable to reach the API')
  })
})
