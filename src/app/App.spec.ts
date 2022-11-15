import { flushPromises, mount } from '@vue/test-utils'

import App from './App.vue'
import { store } from '@/store/store'

function renderComponent(status: string) {
  store.state.globalLoading = true
  store.state.config.tagline = import.meta.env.VITE_NAMESPACE
  store.state.config.status = status

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
  it('renders main view when successful', async () => {
    const wrapper = renderComponent('OK')
    store.dispatch('bootstrap')

    expect(wrapper.find('[data-testid="app-progress-bar"]').exists()).toBe(true)
    await flushPromises()
    expect(wrapper.find('[data-testid="app-progress-bar"]').exists()).toBe(false)

    expect(wrapper.html()).toContain('Create a virtual mesh')
  })

  it('fails to renders basic view', async () => {
    const wrapper = renderComponent('ERROR')
    store.dispatch('bootstrap')

    expect(wrapper.find('[data-testid="app-progress-bar"]').exists()).toBe(true)
    await flushPromises()
    expect(wrapper.find('[data-testid="app-progress-bar"]').exists()).toBe(false)

    expect(wrapper.element).toMatchSnapshot()
  })
})
