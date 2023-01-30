import { afterEach, describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import MainOverviewView from './MainOverviewView.vue'

function renderComponent() {
  return mount(MainOverviewView)
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
