import OnboardingHeading from './OnboardingHeading.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'

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
