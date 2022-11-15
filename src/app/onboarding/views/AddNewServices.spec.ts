import { mount } from '@vue/test-utils'

import AddNewServices from './AddNewServices.vue'

function renderComponent() {
  return mount(AddNewServices)
}

describe('AddNewServices.vue', () => {
  it('renders snapshot', () => {
    const wrapper = renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })

  it('changes selected box', async () => {
    const wrapper = renderComponent()

    const boxes = wrapper.findAll('[data-testid="box"]')
    const demoBox = boxes[0]
    expect(demoBox.element.classList.contains('box--active')).toBe(true)

    const manuallyBox = boxes[1]
    expect(manuallyBox.element.classList.contains('box--active')).toBe(false)

    expect(manuallyBox.html()).toContain('After this wizard')
    await manuallyBox.trigger('click')
    expect(demoBox.element.classList.contains('box--active')).toBe(false)
    expect(manuallyBox.element.classList.contains('box--active')).toBe(true)
  })
})
