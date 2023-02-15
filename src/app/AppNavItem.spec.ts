import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import AppNavItem from './AppNavItem.vue'
import { useStore } from '@/utilities'

const store = useStore()
function renderComponent() {
  return mount(AppNavItem, {
    props: {
      name: 'All',
      routeName: 'data-plane-list-view',
      usesMeshParam: true,
      insightsFieldAccessor: 'mesh.dataplanes.total',
    },
  })
}

describe('AppNavItem.vue', () => {
  test('renders snapshot with link to selected mesh', () => {
    const wrapper = renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })

  test.each([
    [0, '0'],
    [20, '20'],
    [200, '99+'],
  ])('renders amount of items', (numberOfDataplanes, expectedText) => {
    store.state.sidebar.insights.mesh.dataplanes.total = numberOfDataplanes

    const wrapper = renderComponent()

    expect(wrapper.html()).toContain(expectedText)
  })
})
