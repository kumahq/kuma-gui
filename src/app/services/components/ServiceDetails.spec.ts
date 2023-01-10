import { describe, expect, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import ServiceDetails from './ServiceDetails.vue'
import { createDataPlaneOverview } from '@/test-data/createDataPlaneOverview'
import { createExternalService } from '@/test-data/createExternalService'
import { createExternalServiceInsight } from '@/test-data/createExternalServiceInsight'
import { createServiceInsight } from '@/test-data/createServiceInsight'

function renderComponent(props: any = {}) {
  return mount(ServiceDetails, {
    props,
  })
}

describe('ServiceDetails', () => {
  test('shows correct content for ServiceInsights', async () => {
    const wrapper = renderComponent({
      service: createServiceInsight(),
      externalService: null,
      dataPlaneOverviews: [createDataPlaneOverview()],
      dppFilterFields: {},
    })

    const html = wrapper.html()
    expect(html).toContain('partially degraded')
    expect(html).toContain('Data plane proxies')
    expect(html).toContain('1 online / 2 total')
    expect(html).toContain('status')
  })

  test('shows correct content for ExternalServices', async () => {
    const wrapper = renderComponent({
      service: createExternalServiceInsight(),
      externalService: createExternalService(),
      dataPlaneOverviews: null,
      dppFilterFields: {},
    })

    const html = wrapper.html()
    expect(html).toContain('httpbin.org:80')
    expect(html).toContain('Enabled')
  })
})
