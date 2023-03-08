import { datadogLogs } from '@datadog/browser-logs'
import { describe, expect, jest, test } from '@jest/globals'
import { mount } from '@vue/test-utils'

import PaginationWidget from './PaginationWidget.vue'

jest.mock('@datadog/browser-logs')

function renderComponent(props = {}) {
  return mount(PaginationWidget, {
    props,
  })
}

describe('PaginationWidget.vue', () => {
  test('renders nothing if no next or prev props provided', () => {
    const wrapper = renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders pagination', () => {
    const wrapper = renderComponent({
      hasPrevious: true,
      hasNext: true,
    })

    expect(wrapper.element).toMatchSnapshot()
  })

  test('calls buttons', async () => {
    const wrapper = renderComponent({
      hasPrevious: true,
      hasNext: true,
    })

    await wrapper.find('[data-testid="pagination-previous-button"]').trigger('click')
    await wrapper.find('[data-testid="pagination-next-button"]').trigger('click')
    expect(datadogLogs.logger.info).toMatchSnapshot()
  })
})
