import { screen } from '@testing-library/vue'
import NavItem from './NavItem.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'
import TestComponent from '@/testUtils/TestComponent.vue'

describe('NavItem.vue', () => {
  const routes = [
    {
      path: '/:mesh/default',
      name: 'default',
      component: TestComponent,
    },
  ]

  const basicProps = {
    name: 'Default',
    link: 'default',
  }

  it('renders snapshot with link to selected mesh', () => {
    const { container } = renderWithVuex(NavItem, {
      routes,
      propsData: basicProps,
    })

    expect(container).toMatchSnapshot()
  })

  it('renders amount of items', () => {
    renderWithVuex(NavItem, {
      routes,
      propsData: {
        ...basicProps,
        insightsFieldAccessor: 'dataplanes.total',
      },
      store: {
        modules: {
          sidebar: {
            state: {
              insights: {
                dataplanes: {
                  total: 20,
                },
              },
            },
          },
        },
      },
    })

    expect(screen.getByText(/20/)).toBeInTheDocument()
  })

  it('renders 99+ when there is huge amount of units', () => {
    renderWithVuex(NavItem, {
      routes,
      propsData: {
        ...basicProps,
        insightsFieldAccessor: 'dataplanes.total',
      },
      store: {
        modules: {
          sidebar: {
            state: {
              insights: {
                dataplanes: {
                  total: 200,
                },
              },
            },
          },
        },
      },
    })

    expect(screen.getByText(/99+/)).toBeInTheDocument()
  })

  it('renders additonal class when amount equal to 0', () => {
    renderWithVuex(NavItem, {
      routes,
      propsData: {
        ...basicProps,
        insightsFieldAccessor: 'dataplanes.total',
      },
      store: {
        modules: {
          sidebar: {
            state: {
              insights: {
                dataplanes: {
                  total: 0,
                },
              },
            },
          },
        },
      },
    })

    expect(screen.getByText(/0/)).toHaveClass('amount--empty')
  })
})
