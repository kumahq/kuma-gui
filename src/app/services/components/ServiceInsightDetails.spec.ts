import { mount, RouterLinkStub } from '@vue/test-utils'

import ServiceInsightDetails from './ServiceInsightDetails.vue'
import { store, storeKey } from '@/store/store'
import { createServiceInsight } from '@/test-data/createServiceInsight'

const serviceInsight = createServiceInsight()

function renderComponent(props = {}) {
  return mount(ServiceInsightDetails, {
    props: {
      serviceInsight,
      ...props,
    },
    global: {
      plugins: [[store, storeKey]],
      stubs: {
        'router-link': RouterLinkStub,
      },
    },
  })
}

describe('ServiceInsightDetails', () => {
  test('shows correct content', async () => {
    const wrapper = renderComponent()

    expect(wrapper.html()).toContain('Total: 2 (online: 1)')

    const yamlTab = wrapper.find('#yaml-tab')
    await yamlTab.trigger('click')

    expect(wrapper.html()).toContain('status')
    expect(wrapper.html()).toContain('partially_degraded')
  })
})
