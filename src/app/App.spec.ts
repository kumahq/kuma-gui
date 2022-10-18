import { createRouter, createWebHashHistory } from 'vue-router'
import { RouterLinkStub } from '@vue/test-utils'
import { render, screen, waitForElementToBeRemoved } from '@testing-library/vue'

import { store, storeKey } from '@/store/store'
import App from './App.vue'

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

function renderComponent(status: string) {
  store.state.config.status = status

  return render(App, {
    global: {
      plugins: [router, [store, storeKey]],
      stubs: {
        'router-link': RouterLinkStub,
      },
    },
  })
}

describe('App.vue', () => {
  it('renders main view when successful', async () => {
    renderComponent('OK')

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

    expect(screen.getByText('TestComponent')).toBeInTheDocument()
  })

  it('fails to renders basic view', async () => {
    const { container } = renderComponent('ERROR')

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

    expect(container).toMatchSnapshot()
  })
})
