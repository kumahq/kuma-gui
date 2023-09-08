import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import OnboardingNavigation from './OnboardingNavigation.vue'
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
})
