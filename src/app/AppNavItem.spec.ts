import { mount } from '@vue/test-utils'

import AppNavItem from './AppNavItem.vue'
import { createRouter } from '@/router/router'
import { store, storeKey } from '@/store/store'

const router = createRouter()

function renderComponent() {
  return mount(AppNavItem, {
    props: {
      name: 'All',
      routeName: 'data-plane-list-view',
      usesMeshParam: true,
      insightsFieldAccessor: 'mesh.dataplanes.total',
    },
    global: {
      plugins: [router, [store, storeKey]],
    },
  })
}

describe('AppNavItem.vue', () => {
  it('renders snapshot with link to selected mesh', () => {
    const wrapper = renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })

  it.each([
    [0, '0'],
    [20, '20'],
    [200, '99+'],
  ])('renders amount of items', (numberOfDataplanes, expectedText) => {
    store.state.sidebar.insights.mesh.dataplanes.total = numberOfDataplanes

    const wrapper = renderComponent()

    expect(wrapper.html()).toContain(expectedText)
  })
})
