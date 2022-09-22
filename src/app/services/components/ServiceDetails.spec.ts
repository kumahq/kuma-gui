import { flushPromises, shallowMount } from '@vue/test-utils'

import ServiceDetails from './ServiceDetails.vue'
import Kuma from '@/services/kuma'
import { createExternalService } from '@/test-data/createExternalService'
import { createServiceInsight } from '@/test-data/createServiceInsight'

const externalService = createExternalService()
const serviceInsight = createServiceInsight()

function renderComponent(props = {}) {
  return shallowMount(ServiceDetails, {
    props,
  })
}

describe('ServiceDetails', () => {
  beforeAll(() => {
    jest.spyOn(Kuma, 'getExternalService').mockImplementation(() => Promise.resolve(externalService))
    jest.spyOn(Kuma, 'getServiceInsight').mockImplementation(() => Promise.resolve(serviceInsight))
  })

  test.each([
    [externalService, 'ExternalServiceDetails'],
    [serviceInsight, 'ServiceInsightDetails'],
  ])('shows correct content when loading a ServiceInsight entity', async (entity, detailsComponentName) => {
    const wrapper = renderComponent({
      type: entity.type,
      name: entity.name,
      mesh: entity.mesh,
    })

    expect(wrapper.findComponent({ name: 'LoadingBlock' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: detailsComponentName }).exists()).toBe(false)

    await flushPromises()

    expect(wrapper.findComponent({ name: 'LoadingBlock' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: detailsComponentName }).exists()).toBe(true)
  })
})
