import { createStore } from 'vuex'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { KAlert, KBadge, KButton, KCard, KClipboardProvider, KEmptyState, KIcon, KPop, KTable, KTabs } from '@kong/kongponents'

import ZonesView from './ZonesView.vue'

jest.mock('@/helpers', () => {
  const originalModule = jest.requireActual('@/helpers')

  return {
    __esModule: true,
    ...originalModule,
    humanReadableDate: (data: string) => data,
    rawReadableDate: (data: string) => data,
  }
})

function renderComponent() {
  const store = createStore({
    modules: {
      config: {
        namespaced: true,
        state: {
          clientConfig: {
            mode: 'global',
          },
        },
        getters: {
          getVersion: () => undefined,
          getMulticlusterStatus: () => true,
        },
      },
    },
  })

  return render(ZonesView, {
    global: {
      plugins: [store],
      components: { KAlert, KBadge, KButton, KCard, KClipboardProvider, KEmptyState, KIcon, KPop, KTable, KTabs },
      mocks: {
        $route: {
          query: {},
        },
      },
    },
  })
}

describe('ZonesView.vue', () => {
  it('renders snapshot when no multizone', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  it('renders snapshot when multizone', async () => {
    const { container } = renderComponent()

    await screen.findByText(/cluster-1/)
    await screen.findByText(/dpToken/)

    expect(container).toMatchSnapshot()
  })

  it('renders config of multizone', async () => {
    renderComponent()

    await screen.findByText(/dpToken/)

    await userEvent.click(screen.getByText('Config'))
    expect(await screen.findByText(/adminAccessLogPath/)).toBeInTheDocument()
  })

  it('renders zone insights', async () => {
    renderComponent()

    await screen.findByText(/dpToken/)

    await userEvent.click(screen.getByText(/Zone Insights/))
    expect(screen.getByTestId('tab-container')).toMatchSnapshot()
  })
})
