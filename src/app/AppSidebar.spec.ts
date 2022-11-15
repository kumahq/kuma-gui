import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'

import AppSidebar from './AppSidebar.vue'
import { store } from '@/store/store'

async function renderComponent() {
  await store.dispatch('fetchPolicies')

  return mount(AppSidebar, {
    global: {
      stubs: {
        'router-link': RouterLinkStub,
      },
    },
  })
}

describe('AppSidebar.vue', () => {
  it('renders snapshot', async () => {
    const wrapper = await renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders mesh gateways', async () => {
    const wrapper = await renderComponent()

    expect(wrapper.find('[data-testid="meshgateways"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="meshgatewayroutes"]').exists()).toBe(true)
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

    const wrapper = await renderComponent()

    const meshSelector = wrapper.find('[data-testid="mesh-selector"]')
    await meshSelector.setValue('default')
    await flushPromises()

    const navItem = wrapper.find('[data-testid="data-plane-list-view"]')
    expect(navItem.html()).toContain('Data Plane Proxies')
    expect(navItem.html()).toContain('10')
  })
})
