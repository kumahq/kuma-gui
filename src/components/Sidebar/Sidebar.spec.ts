import renderWithVuex from '@/testUtils/renderWithVuex'
import TestComponent from '@/testUtils/TestComponent.vue'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/vue'
import Sidebar from './Sidebar.vue'

describe('Sidebar.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(Sidebar)

    expect(container).toMatchSnapshot()
  })

  it('renders mesh gateways when flag applied', () => {
    renderWithVuex(Sidebar, {
      store: { modules: { config: { state: { clientConfig: { experimental: { meshGateway: true } } } } } },
      routes: [],
    })

    expect(screen.getByTestId('mesh-gateways')).toBeInTheDocument()
    expect(screen.getByTestId('mesh-gateway-routes')).toBeInTheDocument()
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

    await userEvent.selectOptions(screen.getByRole('combobox'), 'default')

    const item = await (await screen.findByText(/8/)).parentNode

    expect(item).toHaveTextContent('Standard 8')
  })
})
