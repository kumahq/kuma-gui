import { mount, RouterLinkStub } from '@vue/test-utils'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createStore } from 'vuex'
import { KCard } from '@kong/kongponents'

import OverviewView from './OverviewView.vue'
import { storeConfig } from '@/store/index'

describe('OverviewView.vue', () => {
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
          path: '/data-planes',
          name: 'data-plane-list-view',
          component: { template: 'TestComponent' },
        },
      ],
    })
    const store = createStore(storeConfig)

    const wrapper = mount(OverviewView, {
      // This is necessary to correctly suppress the amcharts “Chart was not disposed” warning.
      // Its detection logic relies on finding an elements root node
      // which is only possible if the element is actually in the DOM.
      attachTo: document.body,
      global: {
        plugins: [router, store],
        stubs: {
          'router-link': RouterLinkStub,
        },
        components: {
          KCard,
        },
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })
})
