import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'
import { rest } from 'msw'

import DataplanePolicies from './DataplanePolicies.vue'
import { useServer } from '@/../jest/jest-setup-after-env'
import {
  DataPlane,
} from '@/types/index.d'
import { useStore } from '@/utilities'

const store = useStore()
async function renderComponent(props = {}) {
  await store.dispatch('fetchPolicyTypes')
  const dataPlane: DataPlane = {
    type: 'Dataplane',
    mesh: 'foo',
    name: 'dataplane-test-456',
    creationTime: '',
    modificationTime: '',
    networking: {
      address: '',
    },
  }

  return mount(DataplanePolicies, {
    props: {
      dataPlane,
      ...props,
    },
  })
}

describe('DataplanePolicies.vue', () => {
  test('renders snapshot', async () => {
    const wrapper = await renderComponent()

    await flushPromises()

    await wrapper.find('[data-testid="accordion-item-button"]').trigger('click')

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
