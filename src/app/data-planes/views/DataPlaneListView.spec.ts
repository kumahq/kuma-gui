import { createRouter, createWebHashHistory } from 'vue-router'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'

import DataPlaneListView from './DataPlaneListView.vue'
import { store, storeKey } from '@/store/store'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: { template: 'TestComponent' },
    },
  ],
})

async function renderComponent() {
  await store.dispatch('fetchPolicies')

  const wrapper = mount(DataPlaneListView, {
    global: {
      plugins: [router, [store, storeKey]],
      stubs: {
        'router-link': RouterLinkStub,
      },
    },
  })

  await flushPromises()

  return wrapper
}

describe('DataPlaneListView.vue', () => {
  test('matches snapshot', async () => {
    const wrapper = await renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('shows UI elements', async () => {
    const wrapper = await renderComponent()

    const tableRows = wrapper.findAll('[data-testid="data-overview-table"] tr')
    // The number of dataplanes (10) plus the table header row
    expect(tableRows.length).toBe(11)

    const createDataPlaneButton = wrapper.find('[data-testid="data-plane-create-data-plane-button"]')
    expect(createDataPlaneButton.exists()).toBe(true)

    const nsBackButton = wrapper.find('[data-testid="data-plane-ns-back-button"]')
    expect(nsBackButton.exists()).toBe(false)
  })

  test('has expected table data', async () => {
    const wrapper = await renderComponent()

    const tableRowHtml = wrapper.findAll('[data-testid="data-overview-table"] tr')[1].html()
    expect(tableRowHtml).toContain('Online')
    expect(tableRowHtml).toContain('backend')
    expect(tableRowHtml).toContain('default')
    expect(tableRowHtml).toContain('Standard')
    expect(tableRowHtml).toContain('http')
    expect(tableRowHtml).toContain('2/17/2021')
    expect(tableRowHtml).toContain('1.0.7')
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
})
