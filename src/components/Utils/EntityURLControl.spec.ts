import { render, screen } from '@testing-library/vue'
import { KButton, KClipboardProvider, KIcon, KPop } from '@kong/kongponents'

import EntityURLControl from './EntityURLControl.vue'

function renderComponent(props: any, mesh = 'default') {
  return render(EntityURLControl, {
    global: {
      components: {
        KButton,
        KClipboardProvider,
        KIcon,
        KPop,
      },
      mocks: {
        $route: {
          params: {
            mesh,
          },
        },
      },
    },
    props,
  })
}

describe('EntityURLControl.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderComponent({
      name: 'foo',
    })

    expect(container).toMatchSnapshot()
  })

  it('render for mesh all', () => {
    renderComponent({
      name: 'foo',
    }, 'all')

    expect(screen.queryByTestId('entity-url-control')).toBeInTheDocument()
  })
})
