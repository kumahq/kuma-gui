import renderWithVuex from '@/testUtils/renderWithVuex'
import { screen } from '@testing-library/vue'

import Kuma from '@/services/kuma'
import MultiZone from './MultiZone.vue'

describe('MultiZone.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(MultiZone)

    expect(container).toMatchSnapshot()
  })

  it('detects resources on call and allow to proceed', async () => {
    renderWithVuex(MultiZone, {
      routes: [],
    })

    expect(await screen.findByTestId('zone-connected')).toBeInTheDocument()
    expect(await screen.findByTestId('zone-ingress-connected')).toBeInTheDocument()
    expect(screen.queryByText(/Next/)).toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  it('refetch resources if any not available', async () => {
    jest.useFakeTimers()
    jest
      .spyOn(Kuma, 'getAllZoneIngressOverviews')
      .mockReturnValueOnce({
        // @ts-ignore
        total: 0,
      })
      .mockReturnValueOnce({
        // @ts-ignore
        total: 1,
      })

    renderWithVuex(MultiZone, {
      routes: [],
    })

    expect(await screen.findByTestId('zone-connected')).toBeInTheDocument()
    expect(screen.queryByTestId('loading')).toBeInTheDocument()
    expect(screen.queryByTestId('zone-ingress-disconnected')).toBeInTheDocument()

    jest.runAllTimers()

    expect(await screen.findByTestId('zone-ingress-connected')).toBeInTheDocument()
    expect(Kuma.getAllZoneIngressOverviews).toHaveBeenCalledTimes(2)
  })
})
