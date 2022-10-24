import { createRouter, createWebHashHistory } from 'vue-router'
import { render, screen } from '@testing-library/vue'

import EntityURLControl from './EntityURLControl.vue'
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

function renderComponent(props: any) {
  return render(EntityURLControl, {
    global: {
      plugins: [router, [store, storeKey]],
      mocks: {
        $route: {
          params: {
            mesh: 'test-mesh',
          },
        },
      },
    },
    props,
  })
}

describe('EntityURLControl.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderComponent({
      name: 'foo',
    })

    expect(container).toMatchSnapshot()
  })

  it('render for mesh all', () => {
    renderComponent({
      name: 'foo',
    })

    expect(screen.queryByTestId('entity-url-control')).toBeInTheDocument()
  })
})
