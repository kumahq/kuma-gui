import { screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import renderWithVuex from '@/testUtils/renderWithVuex'
import Kuma from '@/services/kuma'
import CircuitBreakers from './CircuitBreakers.vue'

describe('CircuitBreakers.vue', () => {
  it('calls getPolicyConnections only when select the tab', async () => {
    jest.spyOn(Kuma, 'getPolicyConnections')
    renderWithVuex(CircuitBreakers)

    await screen.findByText(/Circuit Breaker: cb1/)

    expect(Kuma.getPolicyConnections).not.toHaveBeenCalled()

    await userEvent.click(screen.getByText(/Affected DPPs/))

    await screen.findByText(/backend/)

    expect(Kuma.getPolicyConnections).toHaveBeenCalledWith({
      mesh: 'default',
      policyName: 'cb1',
      policyType: 'circuit-breakers',
    })

    await userEvent.click(await screen.findByText(/cb2/))

    await screen.findByText(/Circuit Breaker: cb2/)

    expect(Kuma.getPolicyConnections).toHaveBeenCalledWith({
      mesh: 'default',
      policyName: 'cb2',
      policyType: 'circuit-breakers',
    })
  })
})
