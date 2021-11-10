import renderWithVuex from '@/testUtils/renderWithVuex'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/vue'
import TestComponent from '@/testUtils/TestComponent.vue'
import OnboardingHeading from './OnboardingHeading.vue'

describe('OnboardingHeading.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(OnboardingHeading, {
      props: {
        title: 'title',
        description: 'description',
      },
      routes: [],
    })

    expect(container).toMatchSnapshot()
  })

  it('calls skip onboarding', async () => {
    let globalRouter
    let globalVuex

    renderWithVuex(
      OnboardingHeading,
      {
        props: {
          title: 'title',
        },
        routes: [
          {
            path: '/',
            name: 'default',
            component: TestComponent,
          },
        ],
      },
      (vueInstance, vuexStore, router) => {
        globalRouter = router
        globalVuex = vuexStore
      },
    )

    await userEvent.click(screen.getByText(/Skip Setup/))

    // @ts-ignore
    expect(globalRouter.history.current.name).toBe('global-overview')
    // @ts-ignore
    expect(globalVuex.state.onboarding.isCompleted).toBe(true)
  })
})
