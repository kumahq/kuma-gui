import { createRouter, createWebHashHistory } from 'vue-router'
import { mount } from '@vue/test-utils'
import { KIcon } from '@kong/kongponents'

import { store, storeKey } from '@/store/store'
import NotificationManager from './NotificationManager.vue'

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

function renderComponent({ meshes, selectedMesh = 'all' }: { meshes: any, selectedMesh?: string }) {
  store.state.meshes = meshes
  store.state.selectedMesh = selectedMesh

  return mount(NotificationManager, {
    global: {
      plugins: [router, [store, storeKey]],
      components: {
        // TODO: Remove this once https://github.com/Kong/kongponents/pull/806 is merged and published and the library updated.
        KIcon,
      },
    },
  })
}

describe('NotificationManager.vue', () => {
  it('renders snapshot with information that there are actions which user may take', () => {
    const wrapper = renderComponent({
      meshes: {
        items: [{ logging: {}, tracing: {}, metrics: {} }],
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })

  it("doesn't render notification info", () => {
    const wrapper = renderComponent({
      meshes: {
        items: [],
      },
    })

    expect(wrapper.find('[data-testid="notification-info"]').exists()).toBe(false)
  })

  it("doesn't render notification info after it's closed", async () => {
    const wrapper = renderComponent({
      meshes: {
        items: [{}],
      },
    })

    await wrapper.find('[data-testid="notification-info"] [aria-label="Close"]').trigger('click')
    expect(wrapper.find('[data-testid="notification-info"]').exists()).toBe(false)
  })

  it('renders all meshes notification modal', async () => {
    const wrapper = renderComponent({
      meshes: {
        items: [{ name: 'test-mesh' }],
      },
      selectedMesh: 'all',
    })

    const openModalButton = wrapper.find('[data-testid="open-modal-button"]')
    expect(openModalButton.html()).toContain('Check your meshes!')
    await openModalButton.trigger('click')

    expect(wrapper.find('[data-testid="notification-modal"]').element).toMatchSnapshot()
  })

  it('renders single mesh notification modal', async () => {
    const wrapper = renderComponent({
      meshes: {
        items: [{ name: 'test-mesh' }],
      },
      selectedMesh: 'test-mesh',
    })

    const openModalButton = wrapper.find('[data-testid="open-modal-button"]')
    expect(openModalButton.html()).toContain('Check your mesh!')
    await openModalButton.trigger('click')

    expect(wrapper.find('[data-testid="notification-modal"]').element).toMatchSnapshot()
  })
})
