import { describe, expect, jest, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import App from './App.vue'
import { store } from '@/store/store'

// jest can't import this module properly due to transpiling issues
// mock this out with a blank element
jest.mock('vue-github-button', () => ({ template: '<span />' }))

function renderComponent(status: string) {
  store.state.globalLoading = true
  store.state.config.tagline = import.meta.env.VITE_NAMESPACE
  store.state.config.status = status

  return mount(App, {
    global: {
      stubs: {
        // Let’s not unnecessarily render all that chart markup.
        DonutChart: true,
        // keeps the github-button as a <github-button> instead of a span in
        // the snapshot so its as close to actual usage as possible
        GithubButton: true,
      },
    },
  })
}

describe('App.vue', () => {
  test('renders main view when successful', async () => {
    const wrapper = renderComponent('OK')
    store.dispatch('bootstrap')

    expect(wrapper.find('[data-testid="app-progress-bar"]').exists()).toBe(true)
    await flushPromises()
    expect(wrapper.find('[data-testid="app-progress-bar"]').exists()).toBe(false)

    expect(wrapper.html()).toContain('Create a virtual mesh')
  })

  test('fails to renders basic view', async () => {
    const wrapper = renderComponent('ERROR')
    store.dispatch('bootstrap')

    expect(wrapper.find('[data-testid="app-progress-bar"]').exists()).toBe(true)
    await flushPromises()
    expect(wrapper.find('[data-testid="app-progress-bar"]').exists()).toBe(false)

    expect(wrapper.element).toMatchSnapshot()
  })
})
