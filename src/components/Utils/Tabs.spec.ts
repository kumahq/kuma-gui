import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import Tabs from './Tabs.vue'

describe('Tabs.vue', () => {
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
    const { container } = render(Tabs, options)

    expect(container).toMatchSnapshot()
  })

  it('switches tabs on click', async () => {
    render(Tabs, options)

    await userEvent.click(screen.getByText('Kubernetes'))

    expect(screen.getAllByText(/Kubernetes/).length).toBe(2)
  })

  it('renders with initally selected tab', async () => {
    render(Tabs, { ...options, props: { ...options.props, initialTabOverride: 'kubernetes' } })

    expect(screen.getAllByText(/Kubernetes/).length).toBe(2)
  })
})
