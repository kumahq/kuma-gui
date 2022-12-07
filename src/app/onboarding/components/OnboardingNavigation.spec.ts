import { describe, expect, test } from '@jest/globals'
import { mount, RouterLinkStub } from '@vue/test-utils'

import OnboardingNavigation from './OnboardingNavigation.vue'
import { store } from '@/store/store'

function renderComponent(props = {}) {
  return mount(OnboardingNavigation, {
    props: {
      nextStep: 'bar',
      ...props,
    },
    global: {
      stubs: {
        'router-link': RouterLinkStub,
      },
    },
  })
}

describe('OnboardingNavigation.vue', () => {
  test('renders snapshot', () => {
    const wrapper = renderComponent({
      previousStep: 'foo',
    })

    expect(wrapper.element).toMatchSnapshot()
  })

  test('displays different next step title', () => {
    const wrapper = renderComponent({
      previousStep: 'foo',
      nextStepTitle: 'nextStepTitle',
    })

    expect(wrapper.html()).toContain('nextStepTitle')
  })

  test('display disabled next button', () => {
    const wrapper = renderComponent({
      previousStep: 'foo',
      shouldAllowNext: false,
    })

    expect(wrapper.find('[data-testid="onboarding-next-button"]').attributes('disabled')).toBe('true')
  })

  test('doesn\'t display previous step', () => {
    const wrapper = renderComponent()

    expect(wrapper.html()).not.toContain('Back')
  })

  test('changes step to previous', async () => {
    const wrapper = renderComponent({
      previousStep: 'foo',
    })

    expect(store.state.onboarding.step).toBe('onboarding-welcome')

    await wrapper.find('[data-testid="onboarding-previous-button"]').trigger('click')

    expect(store.state.onboarding.step).toBe('foo')
  })

  test('calls skip onboarding', async () => {
    const wrapper = renderComponent({
      previousStep: 'foo',
    })

    expect(store.state.onboarding.isCompleted).toBe(false)

    await wrapper.find('[data-testid="onboarding-skip-button"]').trigger('click')

    expect(store.state.onboarding.isCompleted).toBe(true)
  })
})
