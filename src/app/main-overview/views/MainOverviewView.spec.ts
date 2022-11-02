import { mount, RouterLinkStub } from '@vue/test-utils'

import MainOverviewView from './MainOverviewView.vue'
import { createRouter } from '@/router/router'
import { store, storeKey } from '@/store/store'

const router = createRouter()

describe('MainOverviewView.vue', () => {
  it('renders basic snapshot', () => {
    const wrapper = mount(MainOverviewView, {
      // This is necessary to correctly suppress the amcharts “Chart was not disposed” warning.
      // Its detection logic relies on finding an elements root node
      // which is only possible if the element is actually in the DOM.
      attachTo: document.body,
      global: {
        plugins: [router, [store, storeKey]],
        stubs: {
          'router-link': RouterLinkStub,
        },
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })
})
