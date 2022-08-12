import WelcomeView from './WelcomeView.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'

describe('WelcomeView.vue', () => {
  const customStore = {
    modules: { config: { state: { tagline: 'Kuma', clientConfig: { environment: 'universal' } } } },
  }

  it('renders snapshot', () => {
    const { container } = renderWithVuex(WelcomeView, { store: customStore, routes: [] })

    expect(container).toMatchSnapshot()
  })

  it('renders Kubernetess', () => {
    const { getByText } = renderWithVuex(WelcomeView, {
      routes: [],
      store: { modules: { config: { state: { clientConfig: { mode: 'global', environment: 'kubernetess' } } } } },
    })

    expect(getByText(/Kubernetess/)).toBeInTheDocument()
  })
})
