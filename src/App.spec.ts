import { createRouter, createWebHashHistory } from 'vue-router'
import { RouterLinkStub } from '@vue/test-utils'
import { render, screen, waitForElementToBeRemoved } from '@testing-library/vue'
import { KAlert, KBadge, KButton, KIcon, KModal, KPop } from '@kong/kongponents'

import { store, storeKey } from '@/store/store'
import App from './App.vue'
import TestComponent from '@/testUtils/TestComponent.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TestComponent,
    },
  ],
})

function renderComponent({ status = 'OK' }: { status?: string }) {
  store.state.config.status = status

  return render(App, {
    global: {
      plugins: [router, [store, storeKey]],
      stubs: {
        'router-link': RouterLinkStub,
      },
      components: {
        KAlert,
        KBadge,
        KButton,
        KIcon,
        KModal,
        KPop,
      },
    },
  })
}

describe('App.vue', () => {
  it('renders main view when succesful', async () => {
    renderComponent({ status: 'OK' })

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

    expect(screen.getByText('TestComponent')).toBeInTheDocument()
  })

  it('fails to renders basic view', async () => {
    const { container } = renderComponent({ status: 'ERROR' })

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

    expect(container).toMatchSnapshot()
  })
})
