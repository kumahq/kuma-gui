import { mount } from '@vue/test-utils'

import OnboardingHeading from './OnboardingHeading.vue'

function renderComponent() {
  return mount(OnboardingHeading, {
    props: {
      title: 'title',
      description: 'description',
    },
  })
}

describe('OnboardingHeading.vue', () => {
  it('renders snapshot', () => {
    const wrapper = renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })
})
