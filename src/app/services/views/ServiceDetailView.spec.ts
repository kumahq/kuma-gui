import { beforeAll, describe, expect, jest, test } from '@jest/globals'
import { flushPromises, shallowMount } from '@vue/test-utils'

import ServiceDetailView from './ServiceDetailView.vue'
import { kumaApi } from '@/api/kumaApi'
import { createExternalService } from '@/test-data/createExternalService'
import { createServiceInsight } from '@/test-data/createServiceInsight'

const externalService = createExternalService()
const serviceInsight = createServiceInsight()

function renderComponent(props = {}) {
  return shallowMount(ServiceDetailView, {
    props,
  })
}

describe('ServiceDetailView', () => {
  beforeAll(() => {
    jest.spyOn(kumaApi, 'getExternalService').mockImplementation(() => Promise.resolve(externalService))
    jest.spyOn(kumaApi, 'getServiceInsight').mockImplementation(() => Promise.resolve(serviceInsight))
    jest.spyOn(kumaApi, 'getAllDataplaneOverviewsFromMesh').mockImplementation(() => Promise.resolve({ items: [], total: 0, next: null }))
  })

  test.each([
    [externalService],
    [serviceInsight],
  ])('shows correct content when loading a ServiceInsight entity', async (entity) => {
    const wrapper = renderComponent({
      isExternalServiceView: entity.type === 'ExternalService',
    })

    expect(wrapper.findComponent({ name: 'LoadingBlock' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ServiceDetails' }).exists()).toBe(false)

    await flushPromises()

    expect(wrapper.findComponent({ name: 'LoadingBlock' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'ServiceDetails' }).exists()).toBe(true)
  })
})
