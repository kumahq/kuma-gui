import { screen } from '@testing-library/vue'
import renderWithVuex from '@/testUtils/renderWithVuex'
import GatewayRoutes from './GatewayRoutes.vue'

describe('GatewayRoutes.vue', () => {
  it('renders warning', async () => {
    renderWithVuex(GatewayRoutes)

    expect(
      screen.getByText(/this policy is experimental\. if you encountered any problem please open an/i),
    ).toBeInTheDocument()
  })
})
