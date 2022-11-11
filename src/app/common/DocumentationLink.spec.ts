import { mount } from '@vue/test-utils'

import DocumentationLink from './DocumentationLink.vue'

function renderComponent() {
  return mount(DocumentationLink, {
    props: {
      href: 'https://kuma.io/docs/1.3.2/policies/timeout/',
    },
  })
}

describe('DocumentationLink.vue', () => {
  it('renders snapshot', () => {
    const wrapper = renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })
})
