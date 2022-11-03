import { render, screen } from '@testing-library/vue'

import EntityURLControl from './EntityURLControl.vue'

function renderComponent(props = {}) {
  return render(EntityURLControl, {
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
