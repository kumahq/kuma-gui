import { createRouter, createWebHashHistory } from 'vue-router'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'

import DataPlaneDetails from './DataPlaneDetails.vue'
import { store, storeKey } from '@/store/store'
import { createDataPlane } from '@/test-data/createDataPlane'
import { createDataPlaneOverview } from '@/test-data/createDataPlaneOverview'

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

const dataPlane = createDataPlane()
const dataPlaneOverview = createDataPlaneOverview()

async function renderComponent(props = {}) {
  await store.dispatch('fetchPolicies')

  return mount(DataPlaneDetails, {
    props: {
      dataPlane,
      dataPlaneOverview,
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

describe('DataPlaneDetails', () => {
  test('matches snapshot', async () => {
    const wrapper = await renderComponent()

    await flushPromises()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('shows correct content', async () => {
    const wrapper = await renderComponent()

    expect(wrapper.html()).toContain('DPP: backend')

    const policiesTab = wrapper.find('#dpp-policies-tab')
    await policiesTab.trigger('click')

    // Justification: the underlying DataplanePolicies component loads additional data on mount.
    await flushPromises()

    expect(wrapper.html()).toContain('192.168.0.1:80:81')
  })
})
