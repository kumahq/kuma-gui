import { createStore } from 'vuex'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { KAlert, KBadge, KButton, KCard, KIcon, KModal } from '@kong/kongponents'

import NotificationManager from './NotificationManager.vue'
import notificationsModule from '@/store/modules/notifications/notifications'

function renderComponent({ meshes, selectedMesh = 'all' }: { meshes: any, selectedMesh?: string }) {
  const store = createStore({
    modules: {
      onboarding: {
        namespaced: true,
        getters: {
          showOnboarding: () => false,
        },
      },
      notifications: notificationsModule as any,
    },
    state: {
      meshes,
      selectedMesh,
    },
  })

  return render(NotificationManager, {
    global: {
      plugins: [store],
      components: {
        KAlert,
        KBadge,
        KButton,
        KCard,
        KIcon,
        KModal,
      }
    },
  })
}

describe('NotificationManager.vue', () => {
  it('renders snapshot with information that there are actions which user may take', () => {
    const { container } = renderComponent({
      meshes: {
        items: [{ logging: {}, tracing: {}, metrics: {} }],
      },
    })

    expect(container).toMatchSnapshot()
  })

  it("doesn't render notification info ", () => {
    renderComponent({
      meshes: {
        items: [],
      },
    })

    expect(screen.queryByTestId('notification-info')).not.toBeInTheDocument()
  })

  it("doesn't render notification info after it's closed", async () => {
    renderComponent({
      meshes: {
        items: [{}],
      },
    })

    await userEvent.click(screen.getByLabelText('Close'))

    expect(screen.queryByTestId('notification-info')).not.toBeInTheDocument()
  })

  it('renders all meshes notification modal', async () => {
    renderComponent({
      meshes: {
        items: [{ name: 'test-mesh' }],
      },
      selectedMesh: 'all',
    })

    await userEvent.click(screen.getByText(/Check your meshes!/))

    expect(screen.queryByRole('dialog')).toMatchSnapshot()
  })

  it('renders single mesh notification modal', async () => {
    renderComponent({
      meshes: {
        items: [{ name: 'test-mesh' }],
      },
      selectedMesh: 'test-mesh',
    })

    await userEvent.click(screen.getByText(/Check your mesh!/))

    expect(screen.queryByRole('dialog')).toMatchSnapshot()
  })
})
