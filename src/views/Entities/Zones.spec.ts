import { render, screen } from '@testing-library/vue'
import renderWithVuex from '@/testUtils/renderWithVuex'
import Vue from 'vue'
import Zones from './Zones.vue'

describe('Zones.vue', () => {
  it('renders snapshot when no multizone', () => {
    const { container } = renderWithVuex(Zones)

    expect(container).toMatchSnapshot()
  })

  it('renders snapshot when multizone', async () => {
    const { container } = renderWithVuex(Zones, {
      store: { modules: { config: { state: { clientConfig: { mode: 'global' } } } } },
    })

    await screen.findByText(/cluster-1/)
    await screen.findByText(/dpToken/)

    expect(container).toMatchSnapshot()
  })
})
