import { flushPromises, mount } from '@vue/test-utils'

import AddNewServicesCode from './AddNewServicesCode.vue'
import { kumaApi } from '@/api/kumaApi'

function renderComponent() {
  return mount(AddNewServicesCode)
}

describe('AddNewServicesCode.vue', () => {
  it('renders snapshot', async () => {
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.element).toMatchSnapshot()
  })

  it('detects resources on call and allow to proceed', async () => {
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.find('[data-testid="dpps-connected"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="onboarding-next-button"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="loading"]').exists()).toBe(false)
  })

  it('refetch resources if any not available', async () => {
    jest.useFakeTimers()
    jest
      .spyOn(kumaApi, 'getAllDataplanes')
      .mockResolvedValueOnce({
        items: [],
        total: 0,
        next: null,
      })
      .mockResolvedValueOnce({
        items: [],
        total: 1,
        next: null,
      })

    const wrapper = renderComponent()

    expect(wrapper.find('[data-testid="loading"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="dpps-disconnected"]').exists()).toBe(true)

    await flushPromises()
    jest.runAllTimers()
    await flushPromises()

    expect(wrapper.find('[data-testid="dpps-connected"]').exists()).toBe(true)
    expect(kumaApi.getAllDataplanes).toHaveBeenCalledTimes(2)

    jest.useRealTimers()
  })
})
