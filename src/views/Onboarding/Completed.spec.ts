import renderWithVuex from '@/testUtils/renderWithVuex'
import Completed from './Completed.vue'

describe('Completed.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(Completed)

    expect(container).toMatchSnapshot()
  })
})
