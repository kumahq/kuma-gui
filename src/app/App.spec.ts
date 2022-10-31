import { createRouter, createWebHashHistory } from 'vue-router'
import { RouterLinkStub } from '@vue/test-utils'
import { render, screen, waitForElementToBeRemoved } from '@testing-library/vue'

import App from './App.vue'
import { store, storeKey } from '@/store/store'

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
  store.state.globalLoading = true
  store.state.config.tagline = import.meta.env.VITE_NAMESPACE
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
    store.dispatch('bootstrap')

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

    expect(screen.getByText('TestComponent')).toBeInTheDocument()
  })

  it('fails to renders basic view', async () => {
    const { container } = renderComponent('ERROR')
    store.dispatch('bootstrap')

    await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'))

    expect(container).toMatchSnapshot()
  })
})
