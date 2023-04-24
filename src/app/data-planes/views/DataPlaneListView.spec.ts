import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'
import { RouteLocationNamedRaw } from 'vue-router'

import DataPlaneListView from './DataPlaneListView.vue'
import { useMock } from '@/../jest/jest-setup-after-env'
import { useRouter } from '@/utilities'

async function renderComponent(routeLocation: RouteLocationNamedRaw = {}) {
  const router = useRouter()
  await router.push({
    name: 'data-plane-list-view',
    params: { mesh: 'default' },
    ...routeLocation,
  })

  const wrapper = mount(DataPlaneListView, {
    props: {
      isGatewayView: routeLocation.name === 'gateway-list-view',
    },
  })
  await flushPromises()

  return wrapper
}

describe('DataPlaneListView', () => {
  const mock = useMock()

  test('matches snapshot', async () => {
    mock('/meshes/:mesh/dataplanes+insights', {})
    const wrapper = await renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('has expected content and UI elements', async () => {
    mock('/meshes/:mesh/dataplanes+insights', {
      KUMA_DATAPLANE_COUNT: '9',
    }, (merge) => {
      return merge({
        body: {
          items: [
            {
              name: 'fake-backend',
              mesh: 'fake-default',
              dataplane: {
                networking: {
                  inbound: [
                    {
                      tags: {
                        'kuma.io/protocol': 'http',
                      },
                    },
                  ],
                },
              },
              dataplaneInsight: {
                subscriptions: [
                  {
                    status: {
                      lastUpdateTime: '2021-02-16T08:33:36.442044+01:00',
                    },
                    version: {
                      kumaDp: {
                        version: '1.0.7',
                      },
                    },
                  },
                  {
                    status: {
                      lastUpdateTime: '2021-02-18T08:33:36.442044+01:00',
                    },
                    version: {
                      kumaDp: {
                        version: '1.0.8',
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      })
    })

    const wrapper = await renderComponent()

    const createDataPlaneButton = wrapper.find('[data-testid="data-plane-create-data-plane-button"]')
    expect(createDataPlaneButton.attributes('href')).toBe('/wizard/kubernetes-dataplane')

    const nsBackButton = wrapper.find('[data-testid="data-plane-ns-back-button"]')
    expect(nsBackButton.exists()).toBe(false)

    const refreshButton = wrapper.find('[data-testid="data-overview-refresh-button"]')
    expect(refreshButton.exists()).toBe(true)

    const tableRows = wrapper.findAll('[data-testid="data-overview-table"] tbody tr')

    expect(tableRows.length).toBe(9)

    const firstTableRowHtml = tableRows[0].html()
    const expectedTableRowStrings = ['fake-backend', 'fake-default', 'http', 'February 18, 2021', '1.0.8']
    for (const string of expectedTableRowStrings) {
      expect(firstTableRowHtml).toContain(string)
    }
  })

  test('gateway listing has expected content and UI elements', async () => {
    mock('/meshes/:mesh/dataplanes+insights', {
      KUMA_DATAPLANE_COUNT: '2',
    }, (merge) => {
      return merge({
        body: {
          items: [
            {
              name: 'fake-alarm-gateway-0',
              dataplane: {
                networking: {
                  gateway: {
                    type: 'DELEGATED',
                  },
                },
              },
            },
            {
              name: 'fake-transmitter-gateway-0',
              dataplane: {
                networking: {
                  gateway: {
                    type: 'BUILTIN',
                  },
                },
              },
            },
          ],
        },
      })
    })
    const wrapper = await renderComponent({
      name: 'gateway-list-view',
    })

    const dataPlaneTypeFilter = wrapper.find('[data-testid="data-planes-type-filter"]')
    expect(dataPlaneTypeFilter.findAll('option').length).toBe(3)

    const tableRows = wrapper.findAll('[data-testid="data-overview-table"] tbody tr')
    expect(tableRows.length).toBe(2)

    const firstTableRowHtml = tableRows[0].html()
    for (const string of ['fake-alarm-gateway-0', 'DELEGATED']) {
      expect(firstTableRowHtml).toContain(string)
    }

    const secondTableRowHtml = tableRows[1].html()
    for (const string of ['fake-transmitter-gateway-0', 'BUILTIN']) {
      expect(secondTableRowHtml).toContain(string)
    }
  })

  test('can filter gateway proxies by type', async () => {
    mock('/meshes/:mesh/dataplanes+insights', {
      KUMA_DATAPLANE_COUNT: '1',
    }, (merge) => {
      return merge({
        body: {
          items: [
            {
              name: 'fake-transmitter-gateway-0',
              dataplane: {
                networking: {
                  gateway: {
                    type: 'BUILTIN',
                  },
                },
              },
            },
          ],
        },
      })
    })
    const wrapper = await renderComponent({
      name: 'gateway-list-view',
    })

    const dataPlaneTypeFilter = wrapper.find('[data-testid="data-planes-type-filter"]')
    await dataPlaneTypeFilter.setValue('builtin')
    await flushPromises()

    const tableRows = wrapper.findAll('[data-testid="data-overview-table"] tbody tr')
    expect(tableRows.length).toBe(1)

    const firstTableRowHtml = tableRows[0].html()
    const expectedTableRowStrings = ['fake-transmitter-gateway-0', 'BUILTIN']
    for (const string of expectedTableRowStrings) {
      expect(firstTableRowHtml).toContain(string)
    }

    mock('/meshes/:mesh/dataplanes+insights', {
      KUMA_DATAPLANE_COUNT: '1',
    }, (merge) => {
      return merge({
        body: {
          items: [
            {
              name: 'fake-alarm-gateway-0',
              dataplane: {
                networking: {
                  gateway: {
                    type: 'DELEGATED',
                  },
                },
              },
            },
          ],
        },
      })
    })

    await dataPlaneTypeFilter.setValue('delegated')
    await flushPromises()

    const tableRows2 = wrapper.findAll('[data-testid="data-overview-table"] tbody tr')
    expect(tableRows2.length).toBe(1)

    const firstTableRowHtml2 = tableRows2[0].html()
    for (const string of ['alarm-gateway-0', 'DELEGATED']) {
      expect(firstTableRowHtml2).toContain(string)
    }
  })

  test('shows correct default table columns for proxies', async () => {
    const expectedColumnHeaders = [
      'Status',
      'Name',
      'Service',
      'Protocol',
      'Last Updated',
      'Kuma DP version',
    ]
    const wrapper = await renderComponent()

    const tableHeads = wrapper.findAll('[data-testid="data-overview-table"] th')
    expect(tableHeads.length).toBe(expectedColumnHeaders.length)

    for (let i = 0; i < tableHeads.length; i++) {
      const tableHeadHtml = tableHeads[i].html()
      expect(tableHeadHtml).toContain(expectedColumnHeaders[i])
    }
  })
  test('shows correct default table columns for gateways', async () => {
    const expectedColumnHeaders = [
      'Status',
      'Name',
      'Type',
      'Service',
      'Last Updated',
      'Kuma DP version',
    ]
    const wrapper = await renderComponent({
      name: 'gateway-list-view',
    })

    const tableHeads = wrapper.findAll('[data-testid="data-overview-table"] th')
    expect(tableHeads.length).toBe(expectedColumnHeaders.length)

    for (let i = 0; i < tableHeads.length; i++) {
      const tableHeadHtml = tableHeads[i].html()
      expect(tableHeadHtml).toContain(expectedColumnHeaders[i])
    }
  })

  test('shows information of selected DPP', async () => {
    mock('/meshes/:mesh/dataplanes+insights', {}, (merge) => {
      return merge({
        body: {
          items: [
            {
              name: 'fake-backend',
            },
            {
              name: 'fake-frontend',
            },
          ],
        },
      })
    })
    const wrapper = await renderComponent()

    const secondTableRow = wrapper.findAll('[data-testid="data-overview-table"] tbody tr')[1]
    expect(secondTableRow.html()).toContain('fake-frontend')

    expect(secondTableRow.element.classList.contains('is-selected')).toBe(false)
    expect(wrapper.find('[data-testid="data-plane-proxy-title"]').html()).toContain('fake-backend')

    // The click event listener for selecting a table row is unfortunately added to table cells instead of rows so we need to trigger a click on a cell instead of the row.
    await secondTableRow.find('td').trigger('click')

    expect(secondTableRow.element.classList.contains('is-selected')).toBe(true)
    expect(wrapper.find('[data-testid="data-plane-proxy-title"]').html()).toContain('fake-frontend')
  })
})
