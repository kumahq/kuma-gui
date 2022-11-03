import { mount } from '@vue/test-utils'

import NotificationManager from './NotificationManager.vue'
import { store, storeKey } from '@/store/store'

function renderComponent({ meshes, selectedMesh }: { meshes: any, selectedMesh: string }) {
  store.state.meshes = meshes
  store.state.selectedMesh = selectedMesh

  return mount(NotificationManager, {
    global: {
      plugins: [[store, storeKey]],
    },
  })
}

describe('NotificationManager.vue', () => {
  it('renders snapshot with information that there are actions which user may take', () => {
    const wrapper = renderComponent({
      selectedMesh: 'test-mesh',
      meshes: {
        items: [{ logging: {}, tracing: {}, metrics: {} }],
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })

  it("doesn't render notification info after it's closed", async () => {
    const wrapper = renderComponent({
      selectedMesh: 'test-mesh',
      meshes: {
        items: [{}],
      },
    })

    await wrapper.find('[data-testid="notification-info"] [aria-label="Close"]').trigger('click')
    expect(wrapper.find('[data-testid="notification-info"]').exists()).toBe(false)
  })

  it('renders single mesh notification modal', async () => {
    const wrapper = renderComponent({
      selectedMesh: 'test-mesh',
      meshes: {
        items: [{ name: 'test-mesh' }],
      },
    })

    const openModalButton = wrapper.find('[data-testid="open-modal-button"]')
    expect(openModalButton.html()).toContain('Check your mesh!')
    await openModalButton.trigger('click')

    expect(wrapper.find('[data-testid="notification-modal"]').element).toMatchSnapshot()
  })
})
