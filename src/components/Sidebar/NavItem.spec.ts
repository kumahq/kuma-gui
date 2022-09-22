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
      path: '/mesh/:mesh/data-planes',
      name: 'data-plane-list-view',
      component: TestComponent,
    },
  ],
})
const store = createStore(storeConfig)

function renderComponent() {
  return render(NavItem, {
    props: {
      name: 'All',
      link: 'data-plane-list-view',
      title: false,
      usesMeshParam: true,
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
