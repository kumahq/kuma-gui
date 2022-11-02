import { mount, RouterLinkStub } from '@vue/test-utils'
import { createRouter, createWebHashHistory } from 'vue-router'

import MainOverviewView from './MainOverviewView.vue'
import { store, storeKey } from '@/store/store'

describe('MainOverviewView.vue', () => {
  it('renders basic snapshot', () => {
    const router = createRouter({
      history: createWebHashHistory(),
      routes: [
        {
          path: '/',
          name: 'home',
          component: { template: 'TestComponent' },
        },
        {
          path: '/zones',
          name: 'zones',
          component: { template: 'TestComponent' },
        },
        {
          path: '/mesh/:mesh/data-planes',
          name: 'data-plane-list-view',
          component: { template: 'TestComponent' },
        },
      ],
    })

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
