import renderWithVuex from '@/testUtils/renderWithVuex'
import { screen } from '@testing-library/vue'

import Kuma from '@/services/kuma'
import MultiZoneStatus from './MultiZoneStatus.vue'

describe('MultiZoneStatus.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(MultiZoneStatus)

    expect(container).toMatchSnapshot()
  })

  it('detects resources on call and allow to proceed', async () => {
    renderWithVuex(MultiZoneStatus, {
      routes: [],
    })

    expect(await screen.findByTestId('zone-online')).toBeInTheDocument()
    expect(await screen.findByTestId('zone-ingress-online')).toBeInTheDocument()
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

    renderWithVuex(MultiZoneStatus, {
      routes: [],
    })

    expect(await screen.findByTestId('zone-online')).toBeInTheDocument()
    expect(screen.queryByTestId('loading')).toBeInTheDocument()
    expect(screen.queryByTestId('zone-ingress-offline')).toBeInTheDocument()

    jest.runAllTimers()

    expect(Kuma.getAllZoneIngressOverviews).toHaveBeenCalledTimes(2)

    expect(await screen.findByTestId('zone-ingress-online')).toBeInTheDocument()
  })
})
