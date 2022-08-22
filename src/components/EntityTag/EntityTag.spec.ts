import { render } from '@testing-library/vue'

import EntityTag from './EntityTag.vue'

describe('EntityTag.vue', () => {
  it('renders basic snapshot', () => {
    const { container } = render(EntityTag, {
      props: {
        tag: {
          label: 'kuma.io/service',
          value: 'backend',
        },
      },
    })

    expect(container).toMatchSnapshot()
  })
})
