import { createStore } from 'vuex'
import { RouterLinkStub } from '@vue/test-utils'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'
import { KButton } from '@kong/kongponents'

import OnboardingNavigation from './OnboardingNavigation.vue'
import { storeConfig } from '@/store/index'

const store = createStore(storeConfig)

function renderComponent(props: any) {
  return render(OnboardingNavigation, {
    props,
    global: {
      plugins: [store],
      components: {
        KButton,
      },
      stubs: {
        'router-link': RouterLinkStub
      },
      mocks: {
        $router: {
          push: () => undefined,
        },
      },
    },
  })
}

describe('OnboardingNavigation.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderComponent({
      previousStep: 'foo',
      nextStep: 'default',
    })

    expect(container).toMatchSnapshot()
  })

  it('displays different next step title', () => {
    renderComponent({
      previousStep: 'foo',
      nextStep: 'default',
      nextStepTitle: 'nextStepTitle',
    })

    expect(screen.getByText(/nextStepTitle/)).toBeInTheDocument()
  })

  it('display disabled next button', () => {
    renderComponent({
      previousStep: 'foo',
      nextStep: 'default',
      shouldAllowNext: false,
    })

    expect(screen.getByText(/Next/).closest('a')).toHaveAttribute('disabled')
  })

  it('doesn\'t display previous step', () => {
    renderComponent({
      nextStep: 'default',
    })

    expect(screen.queryByText(/Back/)).not.toBeInTheDocument()
  })

  it('changes step to previous', async () => {
    renderComponent({
      previousStep: 'foo',
      nextStep: 'default',
    })

    // @ts-expect-error because Vuex `createStore`’s return value is missing module state from its type.
    expect(store.state.onboarding.step).toBe('onboarding-welcome')

    await userEvent.click(screen.getByText(/Back/))

    // @ts-expect-error because Vuex `createStore`’s return value is missing module state from its type.
    expect(store.state.onboarding.step).toBe('foo')
  })

  it('calls skip onboarding', async () => {
    renderComponent({
      previousStep: 'foo',
      nextStep: 'default',
    })

    // @ts-expect-error because Vuex `createStore`’s return value is missing module state from its type.
    expect(store.state.onboarding.isCompleted).toBe(false)

    await userEvent.click(screen.getByText(/Skip Setup/))

    // @ts-expect-error because Vuex `createStore`’s return value is missing module state from its type.
    expect(store.state.onboarding.isCompleted).toBe(true)
  })
})
