import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'
import { rest } from 'msw'

import PolicyConnections from './PolicyConnections.vue'
import { useServer, useMock } from '@/../jest/jest-setup-after-env'

function renderComponent(props = {}) {
  return mount(PolicyConnections, {
    props: {
      mesh: 'foo',
      policyType: 'circuit-breakers',
      policyName: 'foo',
      ...props,
    },
  })
}

describe('PolicyConnections.vue', () => {
  const mock = useMock()
  test('renders snapshot', async () => {
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.html()).toContain('frontend')

    expect(wrapper.element).toMatchSnapshot()
  })

  test('filters result', async () => {
    mock('/meshes/:mesh/circuit-breakers/:name/dataplanes', {
      KUMA_DATAPLANE_COUNT: '3',
    }, (merge) => merge({
      body: {
        items: [
          {
            dataplane: {
              name: 'backend',
            },
          },
          {
            dataplane: {
              name: 'db',
            },
          },
          {
            dataplane: {
              name: 'frontend',
            },
          },
        ],
      },
    }))
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.html()).toContain('frontend')

    expect(wrapper.findAll('[data-testid="dataplane-name"]').length).toBe(3)

    const input = wrapper.find('[data-testid="dataplane-search-input"]')
    await input.setValue('b')

    expect(wrapper.findAll('[data-testid="dataplane-name"]').length).toBe(2)
  })

  test('renders loading', () => {
    const wrapper = renderComponent()

    expect(wrapper.find('[data-testid="loading-block"]').exists()).toBe(true)
  })

  test('renders error', async () => {
    const server = useServer()
    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + '/meshes/:mesh/:policyType/:policyName/dataplanes', (req, res, ctx) =>
        res(ctx.status(500), ctx.json({})),
      ),
    )

    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.html()).toContain('An error has occurred while trying to load this data.')
  })

  test('renders no item', async () => {
    const server = useServer()
    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + '/meshes/:mesh/:policyType/:policyName/dataplanes', (req, res, ctx) =>
        res(ctx.status(200), ctx.json({ total: 0, items: [] })),
      ),
    )

    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.html()).toContain('There is no data to display.')
  })
})
