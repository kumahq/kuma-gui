import { RouterLinkStub } from '@vue/test-utils'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'

import AppSidebar from './AppSidebar.vue'
import { createRouter } from '@/router/router'
import { store, storeKey } from '@/store/store'

const router = createRouter()

async function renderComponent() {
  await store.dispatch('fetchPolicies')

  return render(AppSidebar, {
    global: {
      plugins: [router, [store, storeKey]],
      stubs: {
        'router-link': RouterLinkStub,
      },
    },
  })
}

describe('AppSidebar.vue', () => {
  it('renders snapshot', async () => {
    const { container } = await renderComponent()

    expect(container).toMatchSnapshot()
  })

  it('renders mesh gateways', async () => {
    await renderComponent()

    expect(screen.getByTestId('meshgateways')).toBeInTheDocument()
    expect(screen.getByTestId('meshgatewayroutes')).toBeInTheDocument()
  })

  it('refetch data after change of mesh', async () => {
    store.state.selectedMesh = 'hello-world'
    store.state.meshes.total = 1
    store.state.meshes.items = [
      {
        name: 'default',
        type: 'Mesh',
        creationTime: '0001-01-01T00:00:00Z',
        modificationTime: '0001-01-01T00:00:00Z',
      },
    ]

    await renderComponent()

    await userEvent.selectOptions(screen.getByRole('combobox'), 'default')
    const node = await screen.findByText(/10/)

    expect(node.parentNode).toHaveTextContent('Data Plane Proxies 10')
  })
})
