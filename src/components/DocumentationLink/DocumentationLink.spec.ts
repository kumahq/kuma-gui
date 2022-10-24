import { render } from '@testing-library/vue'

import DocumentationLink from './DocumentationLink.vue'

describe('DocumentationLink.vue', () => {
  it('renders snapshot', () => {
    const { container } = render(DocumentationLink, {
      props: {
        href: 'https://kuma.io/docs/1.3.2/policies/timeout/',
      },
    })

    expect(container).toMatchSnapshot()
  })
})
