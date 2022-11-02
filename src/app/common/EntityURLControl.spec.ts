import { render, screen } from '@testing-library/vue'

import EntityURLControl from './EntityURLControl.vue'
import { createRouter } from '@/router/router'
import { store, storeKey } from '@/store/store'

const router = createRouter()

function renderComponent(props: any) {
  return render(EntityURLControl, {
    global: {
      plugins: [router, [store, storeKey]],
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
    })

    expect(screen.queryByTestId('entity-url-control')).toBeInTheDocument()
  })
})
