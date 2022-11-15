import { mount, RouterLinkStub } from '@vue/test-utils'

import OnboardingNavigation from './OnboardingNavigation.vue'
import { store } from '@/store/store'

function renderComponent(props = {}) {
  return mount(OnboardingNavigation, {
    props,
    global: {
      stubs: {
        'router-link': RouterLinkStub,
      },
    },
  })
}

describe('OnboardingNavigation.vue', () => {
  it('renders snapshot', () => {
    const wrapper = renderComponent({
      previousStep: 'foo',
      nextStep: 'bar',
    })

    expect(wrapper.element).toMatchSnapshot()
  })

  it('displays different next step title', () => {
    const wrapper = renderComponent({
      previousStep: 'foo',
      nextStep: 'bar',
      nextStepTitle: 'nextStepTitle',
    })

    expect(wrapper.html()).toContain('nextStepTitle')
  })

  it('display disabled next button', () => {
    const wrapper = renderComponent({
      previousStep: 'foo',
      nextStep: 'bar',
      shouldAllowNext: false,
    })

    expect(wrapper.find('[data-testid="onboarding-next-button"]').attributes('disabled')).toBe('true')
  })

  it('doesn\'t display previous step', () => {
    const wrapper = renderComponent({
      nextStep: 'bar',
    })

    expect(wrapper.html()).not.toContain('Back')
  })

  it('changes step to previous', async () => {
    const wrapper = renderComponent({
      previousStep: 'foo',
      nextStep: 'bar',
    })

    expect(store.state.onboarding.step).toBe('onboarding-welcome')

    await wrapper.find('[data-testid="onboarding-previous-button"]').trigger('click')

    expect(store.state.onboarding.step).toBe('foo')
  })

  it('calls skip onboarding', async () => {
    const wrapper = renderComponent({
      previousStep: 'foo',
      nextStep: 'bar',
    })

    expect(store.state.onboarding.isCompleted).toBe(false)

    await wrapper.find('[data-testid="onboarding-skip-button"]').trigger('click')

    expect(store.state.onboarding.isCompleted).toBe(true)
  })
})
