import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/vue'

import renderWithVuex from '@/testUtils/renderWithVuex'
import TestComponent from '@/testUtils/TestComponent.vue'
import Kuma from '@/services/kuma'
import Sidebar from './Sidebar.vue'

describe('Sidebar.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(Sidebar)

    expect(container).toMatchSnapshot()
  })

  it('renders mesh gateways', async () => {
    const { policies } = await Kuma.getPolicies()

    renderWithVuex(Sidebar, {
      store: {
        state: {
          policies,
        }
      },
      routes: [],
    })

    await waitFor(() => {
      expect(screen.getByTestId('meshgateways')).toBeInTheDocument()
      expect(screen.getByTestId('meshgatewayroutes')).toBeInTheDocument()
    })
  })

  it('refetch data after change of mesh', async () => {
    renderWithVuex(Sidebar, {
      routes: [
        {
          path: '/:mesh/default',
          name: 'default',
          component: TestComponent,
        },
      ],
      store: {
        state: {
          selectedMesh: 'all',
          meshes: { items: [{ name: 'default' }] },
        },
      },
    })

    await waitFor(async () => {
      await userEvent.selectOptions(screen.getByRole('combobox'), 'default')
      const node = await screen.findByText(/8/)

      expect(node.parentNode).toHaveTextContent('Standard 8')
    })
  })
})
