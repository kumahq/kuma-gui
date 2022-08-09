import renderWithVuex from '@/testUtils/renderWithVuex'
import OnboardingNotification from './OnboardingNotification.vue'

describe('OnboardingNotification.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(OnboardingNotification, {
      store: { modules: { config: { state: { kumaDocsVersion: '1.2.0' } } } },
      routes: [],
    })

    expect(container).toMatchSnapshot()
  })
})
