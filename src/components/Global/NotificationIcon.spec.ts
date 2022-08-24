import { createStore } from 'vuex'
import { render, screen } from '@testing-library/vue'
import { KIcon } from '@kong/kongponents'

import NotificationIcon from './NotificationIcon.vue'

function renderComponent() {
  const store = createStore({
    modules: {
      notifications: {
        namespaced: true,
        getters: {
          amountOfActions: () => undefined,
        },
      },
    },
    state: {
      meshes: { items: [{ mtls: {}, logging: {}, tracing: {}, metrics: {} }] },
    },
  })

  return render(NotificationIcon, {
    global: {
      plugins: [store],
      components: {
        KIcon,
      },
    },
  })
}

describe('NotificationIcon.vue', () => {
  it('renders snapshot', async () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  it('renders icon without notification number', async () => {
    renderComponent()

    expect(screen.queryByTestId('notification-amount')).not.toBeInTheDocument()
  })
})
