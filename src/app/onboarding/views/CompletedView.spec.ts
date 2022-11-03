import { render } from '@testing-library/vue'

import CompletedView from './CompletedView.vue'

describe('CompletedView.vue', () => {
  it('renders snapshot', () => {
    const { container } = render(CompletedView)

    expect(container).toMatchSnapshot()
  })
})
