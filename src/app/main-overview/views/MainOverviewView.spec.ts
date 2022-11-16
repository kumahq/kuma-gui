import { afterEach, describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import MainOverviewView from './MainOverviewView.vue'

function renderComponent() {
  return mount(MainOverviewView, {
    // This is necessary to correctly suppress the amcharts “Chart was not disposed” warning. Its detection logic relies on finding an elements root node which is only possible if the element is actually in the DOM.
    attachTo: document.body,
  })
}

describe('MainOverviewView.vue', () => {
  afterEach(() => {
    // Clears `document.body` because we mount the component using `attachTo: document.body`.
    document.body.innerHTML = ''
  })

  test('renders basic snapshot', () => {
    const wrapper = renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })
})
