import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'
import { rest } from 'msw'

import DataplanePolicies from './DataplanePolicies.vue'
import { store } from '@/store/store'
import { server } from '@/../jest/jest-setup-after-env'

async function renderComponent(props = {}) {
  await store.dispatch('fetchPolicies')

  return mount(DataplanePolicies, {
    props,
    global: {
      stubs: {
        'router-link': RouterLinkStub,
      },
    },
  })
}

describe('DataplanePolicies.vue', () => {
  test('renders snapshot', async () => {
    const wrapper = await renderComponent({
      dataPlane: {
        mesh: 'foo',
        name: 'dataplane-test-456',
        networking: {},
      },
    })

    await flushPromises()

    await wrapper.find('[data-testid="accordion-item-button"]').trigger('click')

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders loading', async () => {
    const wrapper = await renderComponent({
      dataPlane: {
        mesh: 'foo',
        name: 'dataplane-test-456',
        networking: {},
      },
    })

    expect(wrapper.find('[data-testid="loading-block"]').exists()).toBe(true)
  })

  test('renders error', async () => {
    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + '/meshes/:mesh/dataplanes/:dataplaneName/policies', (req, res, ctx) =>
        res(ctx.status(500), ctx.json({})),
      ),
    )

    const wrapper = await renderComponent({
      dataPlane: {
        mesh: 'foo',
        name: 'dataplane-test-456',
        networking: {},
      },
    })

    await flushPromises()

    expect(wrapper.html()).toContain('An error has occurred while trying to load this data.')
  })

  test('renders no item', async () => {
    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + '/meshes/:mesh/dataplanes/:dataplaneName/policies', (req, res, ctx) =>
        res(ctx.status(200), ctx.json({ total: 0, items: [] })),
      ),
    )

    const wrapper = await renderComponent({
      dataPlane: {
        mesh: 'foo',
        name: 'dataplane-test-456',
        networking: {},
      },
    })

    await flushPromises()

    expect(wrapper.html()).toContain('There is no data to display.')
  })
})
