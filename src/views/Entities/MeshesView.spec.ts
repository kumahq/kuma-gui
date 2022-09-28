import { RouterLinkStub } from '@vue/test-utils'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { KAlert, KBadge, KButton, KCard, KClipboardProvider, KEmptyState, KIcon, KPop, KTable, KTabs } from '@kong/kongponents'

import MeshesView from './MeshesView.vue'
import { store, storeKey } from '@/store/store'

describe('MeshesView.vue', () => {
  it('renders snapshot with Resource tab', async () => {
    await store.dispatch('fetchPolicies')

    const { container } = render(MeshesView, {
      global: {
        plugins: [[store, storeKey]],
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
      },
    })

    await screen.findByText(/Mesh: default/)

    await userEvent.click(screen.getByText(/Resources/))

    await screen.findByText(/Rate Limits/)

    expect(container).toMatchSnapshot()
  })
})
