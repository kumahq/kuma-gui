import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import TabsWidget from './TabsWidget.vue'

describe('TabsWidget.vue', () => {
  const options = {
    props: {
      tabs: [
        {
          hash: '#universal',
          title: 'Universal',
        },
        {
          hash: '#kubernetes',
          title: 'Kubernetes',
        },
      ],
    },
    slots: {
      universal: '<div>Universal</div>',
      kubernetes: '<div>Kubernetes</div>',
    },
  }

  it('renders basic snapshot', () => {
    const { container } = render(TabsWidget, options)

    expect(container).toMatchSnapshot()
  })

  it('switches tabs on click', async () => {
    render(TabsWidget, options)

    await userEvent.click(screen.getByText('Kubernetes'))

    expect(screen.getAllByText(/Kubernetes/).length).toBe(2)
  })

  it('renders with initally selected tab', () => {
    render(TabsWidget, { ...options, props: { ...options.props, initialTabOverride: 'kubernetes' } })

    expect(screen.getAllByText(/Kubernetes/).length).toBe(2)
  })
})
