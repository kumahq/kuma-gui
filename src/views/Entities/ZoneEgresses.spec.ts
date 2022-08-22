import { createStore } from 'vuex'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { KAlert, KBadge, KButton, KCard, KClipboardProvider, KEmptyState, KIcon, KPop, KTable, KTabs } from '@kong/kongponents'

import { flushPromises } from '@vue/test-utils'
import ZoneEgresses from './ZoneEgresses.vue'

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
      },
    },
  })

  return render(ZoneEgresses, {
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

describe('ZoneEgresses.vue', () => {
  it('renders snapshot when no multizone', async () => {
    const { container } = renderComponent()

    await flushPromises()

    await screen.findByText(/ZoneEgressOverview/)

    expect(container).toMatchSnapshot()
  })

  it('renders snapshot when multizone', async () => {
    const { container } = renderComponent()

    await flushPromises()

    await screen.findByText(/ZoneEgressOverview/)

    expect(container).toMatchSnapshot()
  })

  it('renders zoneegress insights', async () => {
    renderComponent()

    await screen.findByText(/ZoneEgressOverview/)

    await userEvent.click(screen.getByText(/Zone Egress Insights/))
    expect(screen.getByTestId('tab-container')).toMatchSnapshot()
  })
})
