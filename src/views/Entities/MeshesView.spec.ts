import { createStore } from 'vuex'
import { RouterLinkStub } from '@vue/test-utils'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { KAlert, KBadge, KButton, KCard, KClipboardProvider, KEmptyState, KIcon, KPop, KTable, KTabs } from '@kong/kongponents'

import MeshesView from './MeshesView.vue'
import Kuma from '@/services/kuma'

describe('MeshesView.vue', () => {
  it('renders snapshot with Resource tab', async () => {
    const { policies } = await Kuma.getPolicies()
    const store = createStore({
      state: {
        policies,
      },
    })
    const { container } = render(MeshesView, {
      global: {
        plugins: [store],
        components: { KAlert, KBadge, KButton, KCard, KClipboardProvider, KEmptyState, KIcon, KPop, KTable, KTabs },
        mocks: {
          $route: {
            params: {
              mesh: 'all',
            },
          },
        },
        stubs: {
          'router-link': RouterLinkStub,
        },
      }
    })

    await screen.findByText(/Mesh: default/)

    await userEvent.click(screen.getByText(/Resources/))

    await screen.findByText(/Rate Limits/)

    expect(container).toMatchSnapshot()
  })
})
