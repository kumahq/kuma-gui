import { flushPromises, mount } from '@vue/test-utils'

import DataPlaneListView from './DataPlaneListView.vue'
import { router } from '@/../jest/jest-setup-after-env'

async function renderComponent() {
  await router.push({ name: 'data-plane-list-view', params: { mesh: 'default' } })

  const wrapper = mount(DataPlaneListView)
  await flushPromises()

  return wrapper
}

describe('DataPlaneListView', () => {
  test('matches snapshot', async () => {
    const wrapper = await renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('has expected content and UI elements', async () => {
    const wrapper = await renderComponent()

    const dataPlaneTypeFilter = wrapper.find('[data-testid="data-planes-type-filter"]')
    expect(dataPlaneTypeFilter.findAll('option').length).toBe(4)

    const createDataPlaneButton = wrapper.find('[data-testid="data-plane-create-data-plane-button"]')
    expect(createDataPlaneButton.attributes('href')).toBe('/wizard/kubernetes-dataplane')

    const nsBackButton = wrapper.find('[data-testid="data-plane-ns-back-button"]')
    expect(nsBackButton.exists()).toBe(false)

    const refreshButton = wrapper.find('[data-testid="data-overview-refresh-button"]')
    expect(refreshButton.exists()).toBe(true)

    const tableRows = wrapper.findAll('[data-testid="data-overview-table"] tbody tr')
    expect(tableRows.length).toBe(10)

    const firstTableRowHtml = tableRows[0].html()
    const expectedTableRowStrings = ['backend', 'default', 'Standard', 'http', 'February 17, 2021', '1.0.7']
    for (const string of expectedTableRowStrings) {
      expect(firstTableRowHtml).toContain(string)
    }
  })

  test('can filter data plane proxies by type', async () => {
    const wrapper = await renderComponent()

    const dataPlaneTypeFilter = wrapper.find('[data-testid="data-planes-type-filter"]')
    await dataPlaneTypeFilter.setValue('Gateway (builtin)')

    const tableRows = wrapper.findAll('[data-testid="data-overview-table"] tbody tr')
    expect(tableRows.length).toBe(1)

    const firstTableRowHtml = tableRows[0].html()
    const expectedTableRowStrings = ['cluster-1.gateway-01', 'default', 'Gateway (BUILTIN)', 'gateway', 'February 19, 2021', '1.0.0-rc2-211-g823fe8ce']
    for (const string of expectedTableRowStrings) {
      expect(firstTableRowHtml).toContain(string)
    }
  })

  test('shows correct default table columns', async () => {
    const expectedColumnHeaders = [
      'Status',
      'Name',
      'Mesh',
      'Type',
      'Service',
      'Protocol',
      'Last Updated',
      'Kuma DP version',
      'Details',
    ]
    const wrapper = await renderComponent()

    const tableHeads = wrapper.findAll('[data-testid="data-overview-table"] th')

    for (let i = 0; i < tableHeads.length; i++) {
      const tableHeadHtml = tableHeads[i].html()
      expect(tableHeadHtml).toContain(expectedColumnHeaders[i])
    }
  })

  test('shows information of selected DPP', async () => {
    const dppName = 'cluster-1.backend-02'
    const wrapper = await renderComponent()

    const secondTableRow = wrapper.findAll('[data-testid="data-overview-table"] tbody tr')[1]
    expect(secondTableRow.html()).toContain(dppName)

    expect(secondTableRow.element.classList.contains('is-selected')).toBe(false)
    expect(wrapper.find('[data-testid="data-plane-proxy-title"]').html()).toContain('backend')
    expect(window.location.search.includes('name=backend'))

    // The click event listener for selecting a table row is unfortunately added to table cells instead of rows so we need to trigger a click on a cell instead of the row.
    await secondTableRow.find('td').trigger('click')

    expect(secondTableRow.element.classList.contains('is-selected')).toBe(true)
    expect(wrapper.find('[data-testid="data-plane-proxy-title"]').html()).toContain(dppName)
    expect(window.location.search.includes(`name=${dppName}`))
  })
})
