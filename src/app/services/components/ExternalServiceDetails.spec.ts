import { createRouter, createWebHashHistory } from 'vue-router'
import { mount, RouterLinkStub } from '@vue/test-utils'

import ExternalServiceDetails from './ExternalServiceDetails.vue'
import { store, storeKey } from '@/store/store'
import { createExternalService } from '@/test-data/createExternalService'

const externalService = createExternalService()

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: { template: 'TestComponent' },
    },
  ],
})

function renderComponent(props = {}) {
  return mount(ExternalServiceDetails, {
    props: {
      externalService,
      ...props,
    },
    global: {
      plugins: [router, [store, storeKey]],
      stubs: {
        'router-link': RouterLinkStub,
      },
    },
  })
}

describe('ExternalServiceDetails', () => {
  test('shows correct content', async () => {
    const wrapper = renderComponent()

    expect(wrapper.html()).toContain('httpbin.org:80')
    expect(wrapper.html()).toContain('kuma.io/service')
    expect(wrapper.html()).toContain('httpbin')
  })
})
