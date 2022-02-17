import { screen } from '@testing-library/vue'
import renderWithVuex from '@/testUtils/renderWithVuex'
import MeshGatewayRoutes from './MeshGatewayRoutes.vue'

describe('MeshGatewayRoutes.vue', () => {
  it('renders warning', async () => {
    renderWithVuex(MeshGatewayRoutes)

    expect(
      screen.getByText(/this policy is experimental\. if you encountered any problem please open an/i),
    ).toBeInTheDocument()
  })
})
