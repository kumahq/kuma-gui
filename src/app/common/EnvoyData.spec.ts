import { afterEach, describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'
import { rest } from 'msw'

import EnvoyData from './EnvoyData.vue'
import { useServer } from '@/../jest/jest-setup-after-env'

function renderComponent(props = {}) {
  return mount(EnvoyData, {
    attachTo: document.body,
    props: {
      dataPath: 'clusters',
      ...props,
    },
  })
}

describe('EnvoyData.vue', () => {
  afterEach(() => {
    // Clears `document.body` because we mount the component using `attachTo: document.body`.
    document.body.innerHTML = ''
  })

  test('renders snapshot', async () => {
    const server = useServer()
    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + '/meshes/:mesh/dataplanes/:dataplaneName/clusters', (req, res, ctx) =>
        res(ctx.status(200), ctx.json('')),
      ),
    )

    const wrapper = renderComponent({
      mesh: 'foo',
      dppName: 'dataplane-test-456',
    })

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders loading', () => {
    const server = useServer()
    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + '/meshes/:mesh/dataplanes/:dataplaneName/clusters', (req, res, ctx) =>
        res(ctx.status(200), ctx.json('')),
      ),
    )

    const wrapper = renderComponent({
      mesh: 'foo',
      dppName: 'dataplane-test-456',
    })

    expect(wrapper.find('[data-testid="loading-block"]').exists()).toBe(true)
    wrapper.unmount()
  })

  test('renders error', async () => {
    const server = useServer()
    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + '/meshes/:mesh/dataplanes/:dataplaneName/clusters', (req, res, ctx) =>
        res(ctx.status(500), ctx.json('')),
      ),
    )

    const wrapper = renderComponent({
      mesh: 'test-mesh',
      dppName: 'dataplane-test-456',
    })

    await flushPromises()

    expect(wrapper.html()).toContain('An error has occurred while trying to load this data.')
  })
})
