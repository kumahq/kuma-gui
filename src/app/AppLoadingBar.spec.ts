import { afterAll, beforeAll, describe, expect, jest, test } from '@jest/globals'
import { flushPromises, shallowMount } from '@vue/test-utils'

import AppLoadingBar from './AppLoadingBar.vue'

function renderComponent() {
  return shallowMount(AppLoadingBar)
}

describe('AppLoadingBar', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('renders snapshot at the beginning', () => {
    const wrapper = renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('checks if width is max of 100% size', async () => {
    const wrapper = renderComponent()

    jest.advanceTimersByTime(1500)
    await flushPromises()

    expect(wrapper.find('[data-testid="app-progress-bar"]').attributes('style')).toBe('width: 100%;')
  })
})
