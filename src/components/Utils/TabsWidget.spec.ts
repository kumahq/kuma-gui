import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { KIcon, KTabs } from '@kong/kongponents'

import TabsWidget from './TabsWidget.vue'

function renderComponent(props: any) {
  return render(TabsWidget, {
    global: {
      components: {
        KIcon,
        KTabs,
      },
    },
    props,
    slots: {
      universal: '<div>Universal</div>',
      kubernetes: '<div>Kubernetes</div>',
    },
  })
}

describe('TabsWidget.vue', () => {
  it('renders basic snapshot', () => {
    const { container } = renderComponent({
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
    })

    expect(container).toMatchSnapshot()
  })

  it('switches tabs on click', async () => {
    renderComponent({
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
    })

    await userEvent.click(screen.getByText('Kubernetes'))

    expect(screen.getAllByText(/Kubernetes/).length).toBe(2)
  })

  it('renders with initally selected tab', () => {
    renderComponent({
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
      initialTabOverride: 'kubernetes',
    })

    expect(screen.getAllByText(/Kubernetes/).length).toBe(2)
  })
})
