import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/vue'
import OnboardingNavigation from './OnboardingNavigation.vue'
import TestComponent from '@/testUtils/TestComponent.vue'
import renderWithVuex from '@/testUtils/renderWithVuex'

const routes = [
  {
    path: '/',
    name: 'default',
    component: TestComponent,
  },
  {
    path: '/foo',
    name: 'foo',
    component: TestComponent,
  },
]

const props = {
  nextStep: 'default',
}

describe('OnboardingNavigation.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(OnboardingNavigation, {
      props: {
        ...props,
        previousStep: 'foo',
      },
      routes,
    })

    expect(container).toMatchSnapshot()
  })

  it('displays different next step title', () => {
    renderWithVuex(OnboardingNavigation, {
      props: {
        ...props,
        nextStepTitle: 'nextStepTitle',
      },
      routes,
    })

    expect(screen.getByText(/nextStepTitle/)).toBeInTheDocument()
  })

  it('display disabled next button', () => {
    renderWithVuex(OnboardingNavigation, {
      props: {
        ...props,
        shouldAllowNext: false,
      },
      routes,
    })

    expect(screen.getByText(/Next/).closest('a')).toHaveAttribute('disabled')
  })

  it("doesn't display previous step", () => {
    renderWithVuex(OnboardingNavigation, {
      props: {
        ...props,
      },
      routes,
    })

    expect(screen.queryByText(/Back/)).not.toBeInTheDocument()
  })

  it('changes step to previous', async () => {
    let globalRouter
    let globalVuex

    renderWithVuex(
      OnboardingNavigation,
      {
        props: {
          ...props,
          previousStep: 'foo',
        },
        routes,
        slots: {
          selector: '<div>Selector</div>',
        },
      },
      (vueInstance, vuexStore, router) => {
        globalRouter = router
        globalVuex = vuexStore
      },
    )

    await userEvent.click(screen.getByText(/Back/))

    // @ts-ignore
    expect(globalRouter.history.current.name).toBe('foo')
    // @ts-ignore
    expect(globalVuex.state.onboarding.step).toBe('foo')
  })

  it('calls skip onboarding', async () => {
    let globalRouter
    let globalVuex

    renderWithVuex(
      OnboardingNavigation,
      {
        props: {
          ...props,
          previousStep: 'foo',
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
