import { createStore } from 'vuex'
import { flushPromises } from '@vue/test-utils'
import { render, screen } from '@testing-library/vue'
import { KButton, KCard } from '@kong/kongponents'

import MultiZoneView from './MultiZoneView.vue'
import Kuma from '@/services/kuma'
import { storeConfig } from '@/store/index'

const store = createStore(storeConfig)

function renderComponent() {
  return render(MultiZoneView, {
    global: {
      plugins: [store],
      components: {
        KButton,
        KCard,
      },
    },
  })
}

describe('MultiZoneView.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  it('detects resources on call and allow to proceed', async () => {
    renderComponent()

    expect(await screen.findByTestId('zone-connected')).toBeInTheDocument()
    expect(await screen.findByTestId('zone-ingress-connected')).toBeInTheDocument()
    expect(screen.queryByText(/Next/)).toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  it('refetch resources if any not available', async () => {
    jest
      .spyOn(Kuma, 'getAllZoneIngressOverviews')
      .mockResolvedValueOnce({
        total: 0,
      })
      .mockResolvedValueOnce({
        total: 1,
      })

    renderComponent()

    expect(await screen.findByTestId('zone-connected')).toBeInTheDocument()
    expect(screen.queryByTestId('loading')).toBeInTheDocument()
    expect(screen.queryByTestId('zone-ingress-disconnected')).toBeInTheDocument()

    await flushPromises()

    expect(await screen.findByTestId('zone-ingress-connected')).toBeInTheDocument()
    expect(Kuma.getAllZoneIngressOverviews).toHaveBeenCalledTimes(2)
  })
})
