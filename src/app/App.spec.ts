import { render, screen, waitForElementToBeRemoved } from '@testing-library/vue'

import App from './App.vue'
import { store } from '@/store/store'

// jest can't import this module properly due to transpiling issues
// mock this out with a blank element
jest.mock('vue-github-button', () => ({ template: '<span />' }))

function renderComponent(status: string) {
  store.state.globalLoading = true
  store.state.config.tagline = import.meta.env.VITE_NAMESPACE
  store.state.config.status = status

  return render(App, {
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
  it('renders main view when successful', async () => {
    renderComponent('OK')
    store.dispatch('bootstrap')

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

    expect(screen.getByText('Create a virtual mesh')).toBeInTheDocument()
  })

  it('fails to renders basic view', async () => {
    const { container } = renderComponent('ERROR')
    store.dispatch('bootstrap')

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

    expect(container).toMatchSnapshot()
  })
})
