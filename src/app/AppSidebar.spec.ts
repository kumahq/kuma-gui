import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import AppSidebar from './AppSidebar.vue'
import { useMock } from '@/../jest/jest-setup-after-env'
import { useStore } from '@/utilities'

const store = useStore()
async function renderComponent() {
  await store.dispatch('fetchPolicyTypes')

  return mount(AppSidebar)
}

describe('AppSidebar.vue', () => {
  const mock = useMock()
  test('renders snapshot', async () => {
    const wrapper = await renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('refetch data after change of mesh', async () => {
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
    mock('/mesh-insights/:mesh', {
    }, (merge) => {
      return merge({
        body: {
          dataplanes: {
            total: 10,
          },
          dataplanesByType: {
            standard: {
              total: 9,
            },
            gateway: {
              total: 1,
            },
          },
        },
      })
    })

    const wrapper = await renderComponent()

    const meshSelector = wrapper.find('[data-testid="mesh-selector"]')
    await meshSelector.setValue('default')
    await flushPromises()

    expect(wrapper.find('[data-testid="gateway-list-view"]').html()).toContain('1')

    const navItem = wrapper.find('[data-testid="data-plane-list-view"]')
    expect(navItem.html()).toContain('Data Plane Proxies')
    expect(navItem.html()).toContain('9')
  })
})
