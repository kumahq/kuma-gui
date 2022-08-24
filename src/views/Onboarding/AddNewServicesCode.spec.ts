import { createStore } from 'vuex'
import { flushPromises, RouterLinkStub } from '@vue/test-utils'
import { render, screen } from '@testing-library/vue'
import { KButton, KCard, KClipboardProvider, KEmptyState, KIcon, KPop } from '@kong/kongponents'

import AddNewServicesCode from './AddNewServicesCode.vue'
import Kuma from '@/services/kuma'
import { storeConfig } from '@/store/index'

const store = createStore(storeConfig)

function renderComponent() {
  return render(AddNewServicesCode, {
    global: {
      plugins: [store],
      components: {
        KButton,
        KCard,
        KClipboardProvider,
        KEmptyState,
        KIcon,
        KPop,
      },
      stubs: {
        'router-link': RouterLinkStub,
      },
    },
  })
}

describe('AddNewServicesCode.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  it('detects resources on call and allow to proceed', async () => {
    renderComponent()

    expect(await screen.findByTestId('dpps-connected')).toBeInTheDocument()
    expect(screen.queryByText(/Next/)).toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })

  it('refetch resources if any not available', async () => {
    jest
      .spyOn(Kuma, 'getAllDataplanes')
      .mockResolvedValueOnce({
        total: 0,
      })
      .mockResolvedValueOnce({
        total: 1,
      })

    renderComponent()

    expect(screen.queryByTestId('loading')).toBeInTheDocument()
    expect(screen.queryByTestId('dpps-disconnected')).toBeInTheDocument()

    await flushPromises()

    expect(await screen.findByTestId('dpps-connected')).toBeInTheDocument()
    expect(Kuma.getAllDataplanes).toHaveBeenCalledTimes(2)
  })
})
