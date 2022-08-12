import { screen } from '@testing-library/vue'
import NotificationIcon from './NotificationIcon.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'

describe('NotificationIcon.vue', () => {
  it('renders snapshot', async () => {
    const { container } = renderWithVuex(NotificationIcon)

    expect(container).toMatchSnapshot()
  })

  it('renders icon without notification number', async () => {
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
