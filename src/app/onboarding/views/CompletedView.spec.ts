import { RouterLinkStub } from '@vue/test-utils'
import { render } from '@testing-library/vue'

import CompletedView from './CompletedView.vue'

describe('CompletedView.vue', () => {
  it('renders snapshot', () => {
    const { container } = render(CompletedView, {
      global: {
        stubs: {
          'router-link': RouterLinkStub,
        },
      },
    })

    expect(container).toMatchSnapshot()
  })
})
