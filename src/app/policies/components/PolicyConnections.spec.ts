import { flushPromises, mount } from '@vue/test-utils'
import { rest } from 'msw'

import PolicyConnections from './PolicyConnections.vue'
import { server } from '@/../jest/jest-setup-after-env'

function renderComponent(props = {}) {
  return mount(PolicyConnections, { props })
}

describe('PolicyConnections.vue', () => {
  it('renders snapshot', async () => {
    const wrapper = renderComponent({
      mesh: 'foo',
      policyType: 'foo',
      policyName: 'foo',
    })

    await flushPromises()

    expect(wrapper.html()).toContain('frontend')

    expect(wrapper.element).toMatchSnapshot()
  })

  it('filters result', async () => {
    const wrapper = renderComponent({
      mesh: 'foo',
      policyType: 'foo',
      policyName: 'foo',
    })

    await flushPromises()

    expect(wrapper.html()).toContain('frontend')

    expect(wrapper.findAll('[data-testid="dataplane-name"]').length).toBe(3)

    const input = wrapper.find('[data-testid="dataplane-search-input"]')
    await input.setValue('b')

    expect(wrapper.findAll('[data-testid="dataplane-name"]').length).toBe(2)
  })

  it('renders loading', () => {
    const wrapper = renderComponent({
      mesh: 'foo',
      policyType: 'foo',
      policyName: 'foo',
    })

    expect(wrapper.find('[data-testid="loading-block"]').exists()).toBe(true)
  })

  it('renders error', async () => {
    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + 'meshes/:mesh/:policyType/:policyName/dataplanes', (req, res, ctx) =>
        res(ctx.status(500), ctx.json({})),
      ),
    )

    const wrapper = renderComponent({
      mesh: 'foo',
      policyType: 'foo',
      policyName: 'foo',
    })

    await flushPromises()

    expect(wrapper.html()).toContain('An error has occurred while trying to load this data.')
  })

  it('renders no item', async () => {
    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + 'meshes/:mesh/:policyType/:policyName/dataplanes', (req, res, ctx) =>
        res(ctx.status(200), ctx.json({ total: 0, items: [] })),
      ),
    )

    const wrapper = renderComponent({
      mesh: 'foo',
      policyType: 'foo',
      policyName: 'foo',
    })

    await flushPromises()

    expect(wrapper.html()).toContain('There is no data to display.')
  })
})
