import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'
import { rest } from 'msw'

import DataplanePolicies from './DataplanePolicies.vue'
import { useServer } from '@/../jest/jest-setup-after-env'
import { DataPlaneOverview } from '@/types/index.d'
import { useRouter } from '@/utilities'

async function renderComponent(props = {}) {
  const dataplaneOverview: DataPlaneOverview = {
    type: 'DataplaneOverview',
    mesh: 'foo',
    name: 'dataplane-test-456',
    creationTime: '',
    modificationTime: '',
    dataplane: {
      networking: {
        address: '',
      },
    },
  }

  const router = useRouter()
  await router.push({
    name: 'data-plane-detail-view',
    params: {
      mesh: 'default',
      dataPlane: dataplaneOverview.name,
    },
  })

  return mount(DataplanePolicies, {
    props: {
      dataplaneOverview,
      policyTypes: [
        {
          name: 'CircuitBreaker',
          path: 'circuit-breakers',
        },
        {
          name: 'FaultInjection',
          path: 'fault-injections',
        },
      ],
      ...props,
    },
  })
}

describe('DataplanePolicies.vue', () => {
  test('renders snapshot', async () => {
    const wrapper = await renderComponent()

    await flushPromises()

    await wrapper.find('[data-testid="accordion-item-button"]').trigger('click')
    await flushPromises()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders loading', async () => {
    const wrapper = await renderComponent()

    expect(wrapper.find('[data-testid="loading-block"]').exists()).toBe(true)
  })

  test('renders error', async () => {
    const server = useServer()
    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + '/meshes/:mesh/dataplanes/:dataplaneName/policies', (_req, res, ctx) =>
        res(ctx.status(500), ctx.json({})),
      ),
    )

    const wrapper = await renderComponent()

    await flushPromises()

    expect(wrapper.html()).toContain('An error has occurred while trying to load this data.')
  })

  test('renders no item', async () => {
    const server = useServer()
    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + '/meshes/:mesh/dataplanes/:dataplaneName/policies', (req, res, ctx) =>
        res(ctx.status(200), ctx.json({ total: 0, items: [] })),
      ),
    )

    const wrapper = await renderComponent()

    await flushPromises()

    expect(wrapper.html()).toContain('There is no data to display.')
  })
})
