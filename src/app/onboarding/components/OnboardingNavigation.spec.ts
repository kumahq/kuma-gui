import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import OnboardingNavigation from './OnboardingNavigation.vue'
import { useStore } from '@/utilities'

const store = useStore()
function renderComponent(props = {}) {
  return mount(OnboardingNavigation, {
    props: {
      nextStep: 'onboarding-configuration-types',
      ...props,
    },
  })
}

describe('OnboardingNavigation.vue', () => {
  test('renders snapshot', () => {
    const wrapper = renderComponent({
      previousStep: 'onboarding-welcome',
    })

    expect(wrapper.element).toMatchSnapshot()
  })

  test('displays different next step title', () => {
    const wrapper = renderComponent({
      previousStep: 'onboarding-welcome',
      nextStepTitle: 'nextStepTitle',
    })

    expect(wrapper.html()).toContain('nextStepTitle')
  })

  test('display disabled next button', () => {
    const wrapper = renderComponent({
      previousStep: 'onboarding-welcome',
      shouldAllowNext: false,
    })

    expect(wrapper.find('[data-testid="onboarding-next-button"]').attributes('disabled')).toBe('true')
  })

  test('doesn\'t display previous step', () => {
    const wrapper = renderComponent()

    expect(wrapper.html()).not.toContain('Back')
  })

  test('changes step to previous', async () => {
    store.state.onboarding.step = 'onboarding-deployment-types'
    const wrapper = renderComponent({
      previousStep: 'onboarding-welcome',
    })

    expect(store.state.onboarding.step).toBe('onboarding-deployment-types')

    await wrapper.find('[data-testid="onboarding-previous-button"]').trigger('click')

    expect(store.state.onboarding.step).toBe('onboarding-welcome')
  })

  test('calls skip onboarding', async () => {
    const wrapper = renderComponent({
      previousStep: 'onboarding-welcome',
    })

    expect(store.state.onboarding.isCompleted).toBe(false)

    await wrapper.find('[data-testid="onboarding-skip-button"]').trigger('click')

    expect(store.state.onboarding.isCompleted).toBe(true)
  })
})
