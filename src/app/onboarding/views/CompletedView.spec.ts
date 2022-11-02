import { render } from '@testing-library/vue'

import CompletedView from './CompletedView.vue'
import { createRouter } from '@/router/router'

const router = createRouter()

describe('CompletedView.vue', () => {
  it('renders snapshot', () => {
    const { container } = render(CompletedView, {
      global: {
        plugins: [router],
      },
    })

    expect(container).toMatchSnapshot()
  })
})
