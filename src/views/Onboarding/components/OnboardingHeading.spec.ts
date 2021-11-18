import renderWithVuex from '@/testUtils/renderWithVuex'
import OnboardingHeading from './OnboardingHeading.vue'

describe('OnboardingHeading.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(OnboardingHeading, {
      props: {
        title: 'title',
        description: 'description',
      },
    })

    expect(container).toMatchSnapshot()
  })
})
