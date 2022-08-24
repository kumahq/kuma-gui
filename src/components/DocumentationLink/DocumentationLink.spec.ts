import { render } from '@testing-library/vue'
import { KButton, KIcon } from '@kong/kongponents'

import DocumentationLink from './DocumentationLink.vue'

describe('DocumentationLink.vue', () => {
  it('renders snapshot', () => {
    const { container } = render(DocumentationLink, {
      props: {
        href: 'https://kuma.io/docs/1.3.2/policies/timeout/',
      },
      global: {
        components: {
          KButton,
          KIcon,
        },
      },
    })

    expect(container).toMatchSnapshot()
  })
})
