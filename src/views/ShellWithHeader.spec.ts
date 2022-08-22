import { createStore } from 'vuex'
import { createRouter, createWebHashHistory } from 'vue-router'
import { RouterLinkStub } from '@vue/test-utils'
import { render } from '@testing-library/vue'
import { KAlert, KBadge, KButton, KPop } from '@kong/kongponents'

import ShellWithHeader from './ShellWithHeader.vue'
import TestComponent from '@/testUtils/TestComponent.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TestComponent,
    },
  ],
})

const store = createStore({
  modules: {
    config: {
      namespaced: true,
      getters: {
        getStatus: () => undefined,
        getTagline: () => 'Kuma',
        getVersion: () => undefined,
      },
    },
  },
})

describe('ShellWithHeader.vue', () => {
  it('renders component with route', () => {
    const { container } = render(ShellWithHeader, {
      global: {
        plugins: [router, store],
        components: {
          KAlert,
          KBadge,
          KButton,
          KPop,
        },
        stubs: {
          'router-link': RouterLinkStub,
        },
      },
    })

    expect(container).toMatchSnapshot()
  })
})
