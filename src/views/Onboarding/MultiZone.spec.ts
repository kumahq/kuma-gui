import renderWithVuex from '@/testUtils/renderWithVuex'
import MultiZone from './MultiZone.vue'

describe('MultiZone.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(MultiZone)

    expect(container).toMatchSnapshot()
  })
})
