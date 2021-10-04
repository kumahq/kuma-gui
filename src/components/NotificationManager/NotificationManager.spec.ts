import renderWithVuex from '@/testUtils/renderWithVuex'
import { screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import NotificationManager from './NotificationManager.vue'

describe('NotificationManager.vue', () => {
  it('renders snapshot with information that there are actions which user may take', () => {
    const { container } = renderWithVuex(NotificationManager)

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
    renderWithVuex(NotificationManager)

    await userEvent.click(screen.getByLabelText('Close'))

    expect(screen.queryByTestId('notification-info')).not.toBeInTheDocument()
  })

  it('renders modal', async () => {
    renderWithVuex(NotificationManager, {
      store: {
        state: {
          meshes: { items: [{ mtls: {}, logging: {}, tracing: {}, metrics: {} }] },
        },
        modules: { notifications: { getters: { amountOfActions: () => 2 } } },
      },
    })

    await userEvent.click(screen.getByText(/Check!/))

    expect(screen.getByRole('dialog')).toMatchSnapshot()
  })
})
