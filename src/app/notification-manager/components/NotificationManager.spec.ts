import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import NotificationManager from './NotificationManager.vue'
import { useStore } from '@/utilities'

const store = useStore()
function renderComponent({ meshes, selectedMesh }: { meshes: any, selectedMesh: string }) {
  store.state.meshes = meshes
  store.state.selectedMesh = selectedMesh

  return mount(NotificationManager)
}

describe('NotificationManager.vue', () => {
  test('renders single mesh notification modal', async () => {
    const wrapper = renderComponent({
      selectedMesh: 'test-mesh',
      meshes: {
        items: [{ name: 'test-mesh' }],
      },
    })

    await store.dispatch('notifications/openModal')

    expect(wrapper.find('[data-testid="notification-modal"]').element).toMatchSnapshot()
  })
})
