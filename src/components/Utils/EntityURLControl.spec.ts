import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import EntityURLControl from './EntityURLControl.vue'

describe('EntityURLControl.vue', () => {
  it('renders snapshot', () => {
    const { container } = render(EntityURLControl, {
      mocks: {
        $route: {
          params: {
            mesh: 'default',
          },
        },
      },
      props: {
        name: 'foo',
      },
    })

    expect(container).toMatchSnapshot()
  })

  it('display custom message', () => {
    render(EntityURLControl, {
      mocks: {
        $route: {
          params: {
            mesh: 'default',
          },
        },
      },
      props: {
        name: 'foo',
        copyButtonText: 'copy',
      },
    })

    expect(screen.getByText('copy')).toBeInTheDocument()
  })

  it('render for mesh all', () => {
    render(EntityURLControl, {
      mocks: {
        $route: {
          params: {
            mesh: 'all',
          },
        },
      },
      props: {
        name: 'foo',
      },
    })

    expect(screen.queryByTestId('entity-url-control')).toBeInTheDocument()
  })
})
