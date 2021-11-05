import { screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import renderWithVuex from '@/testUtils/renderWithVuex'
import Meshes from './Meshes.vue'

describe('Meshes.vue', () => {
  it('renders snapshot with Resource tab', async () => {
    const { container } = renderWithVuex(Meshes, {
      mocks: {
        $route: {
          params: {
            mesh: 'all',
          },
        },
      },
      stubs: ['router-link'],
    })

    await screen.findByText(/Mesh: default/)

    await userEvent.click(screen.getByText(/Resources/))

    await screen.findByText(/Rate Limits/)

    expect(container).toMatchSnapshot()
  })
})
