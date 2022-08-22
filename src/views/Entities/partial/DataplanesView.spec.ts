import { createStore } from 'vuex'
import { flushPromises, RouterLinkStub } from '@vue/test-utils'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { KAlert, KBadge, KButton, KCard, KClipboardProvider, KEmptyState, KIcon, KPop, KTable, KTabs } from '@kong/kongponents'

import DataplanesView from './DataplanesView.vue'
import Kuma from '@/services/kuma'

async function renderComponent() {
  const { policies } = await Kuma.getPolicies()
  const policiesByType = policies.reduce((obj, policy) => Object.assign(obj, { [policy.name]: policy }), {})
  const store = createStore({
    modules: {
      config: {
        namespaced: true,
        state: {
          tagline: 'Kuma',
          clientConfig: {
            mode: 'global',
            environment: 'universal',
          },
        },
        getters: {
          getTagline: (state) => state.tagline,
          getEnvironment: (state) => state.clientConfig?.environment,
          getMulticlusterStatus: () => false,
        },
      },
    },
    state: {
      policiesByType,
    },
  })

  return render(DataplanesView, {
    global: {
      plugins: [store],
      components: { KAlert, KBadge, KButton, KCard, KClipboardProvider, KEmptyState, KIcon, KPop, KTable, KTabs },
      mocks: {
        $route: {
          params: {
            mesh: 'all',
          },
          query: {},
        },
      },
      stubs: {
        'router-link': RouterLinkStub,
      },
    },
  })
}

describe('DataplanesView.vue', () => {
  it('renders snapshot', async () => {
    const { container } = await renderComponent()

    await flushPromises()

    await screen.findByText(/DataplaneOverview/)

    expect(container).toMatchSnapshot()
  })

  it('calls getDataplanePolicies only when select the tab', async () => {
    jest.spyOn(Kuma, 'getDataplanePolicies')

    await renderComponent()

    await screen.findByText(/DPP: backend/)

    expect(Kuma.getDataplanePolicies).not.toHaveBeenCalled()

    await userEvent.click(screen.getByText(/Policies/))

    await screen.findByText(/192.168.0.1:80:81/)

    expect(Kuma.getDataplanePolicies).toHaveBeenCalledWith({
      mesh: 'default',
      dppName: 'backend',
    })

    await userEvent.click(await screen.findByText(/cluster-1.backend-03/))

    await screen.findByText(/DPP: cluster-1.backend-03/)

    expect(Kuma.getDataplanePolicies).toHaveBeenCalledWith({
      mesh: 'default',
      dppName: 'cluster-1.backend-03',
    })
  })
})
