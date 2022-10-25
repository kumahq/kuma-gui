import { render } from '@testing-library/vue'

import OnboardingHeading from './OnboardingHeading.vue'

describe('OnboardingHeading.vue', () => {
  it('renders snapshot', () => {
    const { container } = render(OnboardingHeading, {
      props: {
        title: 'title',
        description: 'description',
      },
    })

    expect(container).toMatchSnapshot()
  })
})
