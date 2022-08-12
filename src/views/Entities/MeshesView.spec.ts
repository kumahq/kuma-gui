import { screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

import MeshesView from './MeshesView.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'
import Kuma from '@/services/kuma'

describe('MeshesView.vue', () => {
  it('renders snapshot with Resource tab', async () => {
    const { policies } = await Kuma.getPolicies()
    const { container } = renderWithVuex(MeshesView, {
      mocks: {
        $route: {
          params: {
            mesh: 'all',
          },
        },
      },
      stubs: ['router-link'],
      store: {
        state: {
          policies
        },
      },
    })

    await screen.findByText(/Mesh: default/)

    await userEvent.click(screen.getByText(/Resources/))

    await screen.findByText(/Rate Limits/)

    expect(container).toMatchSnapshot()
  })
})
