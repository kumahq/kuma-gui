import { createStore } from 'vuex'
import { createRouter, createWebHashHistory } from 'vue-router'
import { RouterLinkStub } from '@vue/test-utils'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor } from '@testing-library/vue'
import { KAlert, KIcon } from '@kong/kongponents'

import AppSidebar from './AppSidebar.vue'
import { storeConfig } from '@/store/index'
import Kuma from '@/services/kuma'
import TestComponent from '@/testUtils/TestComponent.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TestComponent,
    },
  ],
})
const store = createStore(storeConfig)

function renderComponent() {
  return render(AppSidebar, {
    global: {
      plugins: [router, store],
      stubs: {
        'router-link': RouterLinkStub,
      },
      components: {
        KAlert,
        KIcon,
      },
    },
  })
}

describe('AppSidebar.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  it('renders mesh gateways', async () => {
    const { policies } = await Kuma.getPolicies()

    store.state.policies = policies
    renderComponent()

    await waitFor(() => {
      expect(screen.getByTestId('meshgateways')).toBeInTheDocument()
      expect(screen.getByTestId('meshgatewayroutes')).toBeInTheDocument()
    })
  })

  it('refetch data after change of mesh', async () => {
    store.state.selectedMesh = 'all'
    store.state.meshes.items = [
      {
        name: 'default',
        type: 'Mesh',
        creationTime: '0001-01-01T00:00:00Z',
        modificationTime: '0001-01-01T00:00:00Z',
      },
    ]

    renderComponent()

    await waitFor(async () => {
      await userEvent.selectOptions(screen.getByRole('combobox'), 'default')
      const node = await screen.findByText(/8/)

      expect(node.parentNode).toHaveTextContent('Standard 8')
    })
  })
})
