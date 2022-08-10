import OnboardingNotification from './OnboardingNotification.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'

describe('OnboardingNotification.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(OnboardingNotification, {
      store: { modules: { config: { state: { kumaDocsVersion: '1.2.0' } } } },
      routes: [],
    })

    expect(container).toMatchSnapshot()
  })
})
