import renderWithVuex from '@/testUtils/renderWithVuex'
import { screen } from '@testing-library/vue'
import NotificationIcon from './NotificationIcon.vue'

describe('NotificationIcon.vue', () => {
  it('renders snapshot', async () => {
    const { container } = renderWithVuex(NotificationIcon)

    expect(container).toMatchSnapshot()
  })

  it('renders snapshot without notifications', async () => {
    renderWithVuex(NotificationIcon, {
      store: {
        state: {
          meshes: { items: [{ mtls: {}, logging: {}, tracing: {}, metrics: {} }] },
        },
      },
    })

    expect(screen.queryByTestId('notification-amount')).not.toBeInTheDocument()
  })
})
