import renderWithVuex from '@/testUtils/renderWithVuex'
import Welcome from './Welcome.vue'

describe('Welcome.vue', () => {
  const customStore = {
    modules: { config: { state: { tagline: 'Kuma', clientConfig: { environment: 'universal' } } } },
  }

  it('renders snapshot', () => {
    const { container } = renderWithVuex(Welcome, { store: customStore, routes: [] })

    expect(container).toMatchSnapshot()
  })

  it('renders multi-zone', () => {
    const { getByText } = renderWithVuex(Welcome, {
      routes: [],
      store: { modules: { config: { state: { clientConfig: { mode: 'global', environment: 'universal' } } } } },
    })

    expect(getByText(/Multi-Zone/)).toBeInTheDocument()
  })
})
