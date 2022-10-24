import { RouterLinkStub } from '@vue/test-utils'
import { rest } from 'msw'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

import DataplanePolicies from './DataplanePolicies.vue'
import { store, storeKey } from '@/store/store'
import { server } from '@/jest-setup'

async function renderComponent(props = {}) {
  await store.dispatch('fetchPolicies')

  return render(DataplanePolicies, {
    global: {
      plugins: [[store, storeKey]],
      stubs: {
        'router-link': RouterLinkStub,
      },
    },
    props,
  })
}

describe('DataplanePolicies.vue', () => {
  it('renders snapshot', async () => {
    const { container } = await renderComponent({
      dataPlane: {
        mesh: 'foo',
        name: 'dataplane-test-456',
        networking: {},
      },
    })

    await userEvent.click(await screen.findByText('web'))

    expect(container).toMatchSnapshot()
  })

  it('renders loading', async () => {
    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + 'meshes/:mesh/dataplanes/:dataplaneName/policies', (req, res, ctx) =>
        res(ctx.status(200), ctx.json({ total: 0, items: [] })),
      ),
    )

    await renderComponent({
      dataPlane: {
        mesh: 'foo',
        name: 'dataplane-test-456',
        networking: {},
      },
    })

    expect(screen.getByTestId('loading-block')).toBeInTheDocument()
  })

  it('renders error', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => { }) // silence console errors

    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + 'meshes/:mesh/dataplanes/:dataplaneName/policies', (req, res, ctx) =>
        res(ctx.status(500), ctx.json({})),
      ),
    )

    await renderComponent({
      dataPlane: {
        mesh: 'foo',
        name: 'dataplane-test-456',
        networking: {},
      },
    })

    expect((await screen.findAllByText(/An error has occurred while trying to load this data./))[0]).toBeInTheDocument()
  })

  it('renders no item', async () => {
    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + 'meshes/:mesh/dataplanes/:dataplaneName/policies', (req, res, ctx) =>
        res(ctx.status(200), ctx.json({ total: 0, items: [] })),
      ),
    )

    await renderComponent({
      dataPlane: {
        mesh: 'foo',
        name: 'dataplane-test-456',
        networking: {},
      },
    })

    expect(await screen.findByText(/There is no data to display./)).toBeInTheDocument()
  })
})
