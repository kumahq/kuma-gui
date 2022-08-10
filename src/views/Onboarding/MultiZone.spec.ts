import { screen } from '@testing-library/vue'

import MultiZone from './MultiZone.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'
import Kuma from '@/services/kuma'

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

    // Advance asynchronous routines by making sure the queue of micro tasks is processed.
    // TODO: In @vue/test-utils@2, use `flushPromises` instead.
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(await screen.findByTestId('zone-ingress-connected')).toBeInTheDocument()
    expect(Kuma.getAllZoneIngressOverviews).toHaveBeenCalledTimes(2)
  })
})
