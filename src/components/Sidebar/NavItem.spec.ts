import { createStore } from 'vuex'
import { createRouter, createWebHashHistory } from 'vue-router'
import { render, screen } from '@testing-library/vue'
import { KIcon } from '@kong/kongponents'

import NavItem from './NavItem.vue'
import TestComponent from '@/testUtils/TestComponent.vue'
import { storeConfig } from '@/store/index'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TestComponent,
    },
    {
      path: '/:mesh/default',
      name: 'default',
      component: TestComponent,
    },
  ],
})
const store = createStore(storeConfig)

function renderComponent() {
  return render(NavItem, {
    props: {
      name: 'Default',
      link: 'default',
      insightsFieldAccessor: 'mesh.dataplanes.total',
    },
    global: {
      plugins: [router, store],
      components: {
        KIcon,
      },
    },
  })
}

describe('NavItem.vue', () => {
  it('renders snapshot with link to selected mesh', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  it.each([
    [0, '0'],
    [20, '20'],
    [200, '99+'],
  ])('renders amount of items', (numberOfDataplanes, expectedText) => {
    // @ts-expect-error because Vuex `createStore`’s return value is missing module state from its type.
    store.state.sidebar.insights.mesh.dataplanes.total = numberOfDataplanes

    renderComponent()

    expect(screen.getByText(expectedText)).toBeInTheDocument()
  })
})
