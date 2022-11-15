import { flushPromises, mount } from '@vue/test-utils'
import { datadogLogs } from '@datadog/browser-logs'

import DataOverview from './DataOverview.vue'

jest.mock('@datadog/browser-logs')

function renderComponent(props = {}) {
  return mount(DataOverview, {
    props,
    slots: {
      custom: `
        <ul>
          <li>test</li>
        </ul>
      `,
    },
  })
}

describe('DataOverview.vue', () => {
  beforeEach(() => {
    (datadogLogs.logger.info as jest.MockedFunction<any>).mockClear()
  })

  it('renders basic snapshot', () => {
    const wrapper = renderComponent({
      tableData: {
        headers: [],
        data: [],
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })

  it('renders additional scoped slot', async () => {
    const wrapper = renderComponent({
      tableData: {
        headers: [
          { key: 'custom', hideLabel: true },
        ],
        data: [
          {
            custom: ['custom', 'values', 'in', 'an', 'array'],
          },
        ],
      },
    })

    await flushPromises()

    expect(wrapper.find('table').element).toMatchSnapshot()
  })

  it('renders pagination and react on click', async () => {
    const wrapper = renderComponent({
      next: true,
      tableData: {
        headers: [],
        data: [],
      },
    })

    const next = wrapper.find('[data-testid="pagination-next-button"]')

    expect(next.exists()).toBe(true)
    expect(wrapper.find('[data-testid="pagination-previous-button"]').exists()).toBe(false)

    await next.trigger('click')

    const previous = wrapper.find('[data-testid="pagination-previous-button"]')

    expect(wrapper.find('[data-testid="pagination-next-button"]').exists()).toBe(true)
    expect(previous.exists()).toBe(true)

    await previous.trigger('click')

    expect(wrapper.find('[data-testid="pagination-next-button"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="pagination-previous-button"]').exists()).toBe(false)
  })

  it('refresh page on second page', async () => {
    const wrapper = renderComponent({
      next: true,
      tableData: {
        headers: [],
        data: [],
      },
    })

    const next = wrapper.find('[data-testid="pagination-next-button"]')
    const refresh = wrapper.find('[data-testid="data-overview-refresh-button"]')

    expect(next.exists()).toBe(true)

    await next.trigger('click')
    await refresh.trigger('click')

    expect(datadogLogs.logger.info).toMatchSnapshot()
  })

  it('renders all custom templates for data', async () => {
    const wrapper = renderComponent({
      showWarnings: true,
      tableData: {
        headers: [
          { key: 'actions', hideLabel: true },
          { label: 'Status', key: 'status' },
          { label: 'Total Updates', key: 'totalUpdates' },
          { label: 'Kuma DP version', key: 'dpVersion' },
          { label: 'Envoy version', key: 'envoyVersion' },
          { key: 'warnings', hideLabel: true },
        ],
        data: [
          {
            status: 'offline',
            totalUpdates: 1,
            dpVersion: 'foo',
            envoyVersion: '1.2',
            withWarnings: true,
          },
        ],
      },
    })

    await flushPromises()

    expect(wrapper.element).toMatchSnapshot()
  })
})
