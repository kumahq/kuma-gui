import { flushPromises, mount } from '@vue/test-utils'

import DataPlaneDetails from './DataPlaneDetails.vue'
import { store } from '@/store/store'
import { createDataPlane } from '@/test-data/createDataPlane'
import { createDataPlaneOverview } from '@/test-data/createDataPlaneOverview'

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
  })
}

describe('DataPlaneDetails', () => {
  test('matches snapshot', async () => {
    const wrapper = await renderComponent()

    await flushPromises()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('has expected content and UI elements', async () => {
    const expectedOverviewStrings = ['DPP: backend', 'test-mesh', 'Online', 'kuma.io/service: backend', 'kuma.io/protocol: http', 'envoy', '1.16.2', 'kumaDp', '1.0.7', 'coredns', '1.8.3']
    const expectedInsightStrings = ['Connect time: February 17, 2021 at 7:33:36 AM', 'Control Plane Instance ID', 'Disconnect time: February 17, 2021 at 7:33:36 AM']
    const expectedPoliciesStrings = ['web', 'inbound 192.168.0.1:80:81', 'backend', 'outbound 192.168.0.2:8080']

    const wrapper = await renderComponent()

    let html = wrapper.html()
    for (const string of expectedOverviewStrings) {
      expect(html).toContain(string)
    }

    await wrapper.find('#insights-tab').trigger('click')

    html = wrapper.html()
    for (const string of expectedInsightStrings) {
      expect(html).toContain(string)
    }

    await wrapper.find('#dpp-policies-tab').trigger('click')

    // Justification: the underlying DataplanePolicies component loads additional data on mount.
    await flushPromises()

    html = wrapper.html()
    for (const string of expectedPoliciesStrings) {
      expect(html).toContain(string)
    }
  })
})
