import renderWithVuex from '@/testUtils/renderWithVuex'
import TestComponent from '@/testUtils/TestComponent.vue'
import NavItem from './NavItem.vue'

describe('NavItem.vue', () => {
  it('renders snapshot with link to selected mesh', () => {
    const { container } = renderWithVuex(NavItem, {
      routes: [
        {
          path: '/:mesh/default',
          name: 'default',
          component: TestComponent,
        },
      ],
      propsData: {
        name: 'Default',
        link: 'default',
      },
    })

    expect(container).toMatchSnapshot()
  })
})
