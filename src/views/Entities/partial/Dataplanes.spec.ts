import { screen } from '@testing-library/vue'
import renderWithVuex from '@/testUtils/renderWithVuex'
import Dataplanes from './Dataplanes.vue'

describe('Dataplanes.vue', () => {
  it('renders snapshot with Resource tab', async () => {
    const { container } = renderWithVuex(Dataplanes, {
      mocks: {
        $route: {
          params: {
            mesh: 'all',
          },
          query: {},
        },
      },
      stubs: ['router-link'],
    })

    await screen.findByText(/DataplaneOverview/)

    expect(container).toMatchSnapshot()
  })
})
