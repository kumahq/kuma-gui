import { screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import NotificationManager from './NotificationManager.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'

describe('NotificationManager.vue', () => {
  it('renders snapshot with information that there are actions which user may take', () => {
    const { container } = renderWithVuex(NotificationManager, {
      store: {
        state: {
          meshes: { items: [{ logging: {}, tracing: {}, metrics: {} }] },
        },
      },
    })

    expect(container).toMatchSnapshot()
  })

  it("doesn't render notification info ", () => {
    renderWithVuex(NotificationManager, {
      store: {
        state: {
          meshes: { items: [{ mtls: {}, logging: {}, tracing: {}, metrics: {} }] },
        },
      },
    })

    expect(screen.queryByTestId('notification-info')).not.toBeInTheDocument()
  })

  it("doesn't render notification info after it's closed", async () => {
    renderWithVuex(NotificationManager, {
      store: {
        state: {
          meshes: { items: [{}] },
        },
      },
    })

    await userEvent.click(screen.getByLabelText('Close'))

    expect(screen.queryByTestId('notification-info')).not.toBeInTheDocument()
  })

  it('renders all meshes notification modal', async () => {
    renderWithVuex(NotificationManager, {
      store: {
        state: {
          meshes: { items: [{ name: 'test-mesh' }] },
        },
      },
    })

    await userEvent.click(screen.getByText(/Check your meshes!/))

    expect(screen.getByRole('dialog')).toMatchSnapshot()
  })

  it('renders single mesh notification modal', async () => {
    renderWithVuex(NotificationManager, {
      store: {
        state: {
          selectedMesh: 'test-mesh',
          meshes: { items: [{ name: 'test-mesh' }] },
        },
      },
    })

    await userEvent.click(screen.getByText(/Check your mesh!/))

    expect(screen.getByRole('dialog')).toMatchSnapshot()
  })
})
