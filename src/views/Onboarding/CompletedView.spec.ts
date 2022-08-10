import CompletedView from './CompletedView.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'

describe('CompletedView.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(CompletedView)

    expect(container).toMatchSnapshot()
  })
})
