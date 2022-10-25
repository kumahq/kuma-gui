import { createRouter, createWebHashHistory } from 'vue-router'
import { RouterLinkStub } from '@vue/test-utils'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { KAlert, KBadge, KButton, KCard, KClipboardProvider, KEmptyState, KIcon, KPop, KTable, KTabs } from '@kong/kongponents'

import ZonesView from './ZonesView.vue'
import { store, storeKey } from '@/store/store'
import { ClientConfigInterface } from '@/store/modules/config/config.types'
import * as config from '@/services/mock/responses/config.json'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: { template: 'TestComponent' },
    },
  ],
})

jest.mock('@/helpers', () => {
  const originalModule = jest.requireActual('@/helpers')

  return {
    __esModule: true,
    ...originalModule,
    humanReadableDate: (data: string) => data,
    rawReadableDate: (data: string) => data,
  }
})

function renderComponent(mode = 'standalone') {
  const clientConfig: ClientConfigInterface = { ...config, mode }
  store.state.config.clientConfig = clientConfig

  return render(ZonesView, {
    global: {
      plugins: [router, [store, storeKey]],
      stubs: {
        'router-link': RouterLinkStub,
      },
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
    const { container } = renderComponent('global')

    await screen.findByText(/cluster-1/)
    await screen.findByText(/dpToken/)

    expect(container).toMatchSnapshot()
  })

  it('renders config of multizone', async () => {
    renderComponent('global')

    await screen.findByText(/dpToken/)

    await userEvent.click(screen.getByText('Config'))
    expect(await screen.findByText(/adminAccessLogPath/)).toBeInTheDocument()
  })

  it('renders zone insights', async () => {
    renderComponent('global')

    await screen.findByText(/dpToken/)

    await userEvent.click(screen.getByText(/Zone Insights/))
    expect(screen.getByTestId('tab-container')).toMatchSnapshot()
  })
})
