import { createStore } from 'vuex'
import { createRouter, createWebHashHistory } from 'vue-router'
import { flushPromises, RouterLinkStub } from '@vue/test-utils'
import { render } from '@testing-library/vue'
import { KAlert, KBadge, KButton, KIcon, KModal, KPop } from '@kong/kongponents'

import AppShell from './AppShell.vue'
import TestComponent from '@/testUtils/TestComponent.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TestComponent,
    },
    {
      path: '/overview',
      name: 'global-overview',
      component: TestComponent,
    },
    {
      path: '/diagnostics',
      name: 'diagnostics',
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
    onboarding: {
      namespaced: true,
      getters: {
        showOnboarding: () => false,
      },
    },
    sidebar: {
      namespaced: true,
      state: {
        insights: {},
      },
    },
    notifications: {
      namespaced: true,
      getters: {
        amountOfActions: () => undefined,
      },
    },
  },
  state: {
    policies: [],
    meshes: [{}],
  },
})

describe('AppShell.vue', () => {
  it('renders component with route', async () => {
    const { container } = render(AppShell, {
      global: {
        plugins: [router, store],
        components: {
          KAlert,
          KBadge,
          KButton,
          KIcon,
          KModal,
          KPop,
        },
        stubs: {
          'router-link': RouterLinkStub,
        },
      },
    })

    await flushPromises()

    expect(container).toMatchSnapshot()
  })
})
