import { screen } from '@testing-library/vue'

import MultiZoneView from './MultiZoneView.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'
import Kuma from '@/services/kuma'

describe('MultiZoneView.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(MultiZoneView)

    expect(container).toMatchSnapshot()
  })

  it('detects resources on call and allow to proceed', async () => {
    renderWithVuex(MultiZoneView, {
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

    renderWithVuex(MultiZoneView, {
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
