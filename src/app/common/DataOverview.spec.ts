import { datadogLogs } from '@datadog/browser-logs'
import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

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

  test('renders basic snapshot', () => {
    const wrapper = renderComponent({
      tableData: {
        headers: [],
        data: [],
      },
    })

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders additional scoped slot', async () => {
    const wrapper = renderComponent({
      tableData: {
        headers: [
          { key: 'custom', hideLabel: true },
        ],
        data: [
          {
            name: 'test',
            custom: ['custom', 'values', 'in', 'an', 'array'],
          },
        ],
      },
    })

    await flushPromises()

    expect(wrapper.find('table').element).toMatchSnapshot()
  })

  test('renders pagination and react on click', async () => {
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

  test('refresh page on second page', async () => {
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

  test('renders all custom templates for data', async () => {
    const wrapper = renderComponent({
      selectedEntityName: 'bandwidth-49',
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
            entity: {
              type: 'ZoneOverview',
              name: 'bandwidth-49',
              creationTime: '2021-02-19T08:06:15.380674+01:00',
              modificationTime: '2021-02-19T08:06:15.380674+01:00',
              zone: {
                enabled: true,
              },
              zoneInsight: {
                subscriptions: [],
              },
            },
            detailViewRoute: {
              name: 'zone-detail-view',
              params: {
                zone: 'bandwidth-49',
              },
            },
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
