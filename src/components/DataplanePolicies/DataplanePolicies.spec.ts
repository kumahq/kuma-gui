import { rest } from 'msw'
import { screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

import Kuma from '@/services/kuma'
import renderWithVuex from '@/testUtils/renderWithVuex'
import { server } from '@/jest-setup'
import DataplanePolicies from './DataplanePolicies.vue'

describe('DataplanePolicies.vue', () => {
  it('renders snapshot', async () => {
    const { policies } = await Kuma.getPolicies()
    const policiesByType = policies.reduce((obj, policy) => Object.assign(obj, { [policy.name]: policy }), {})

    const { container } = renderWithVuex(DataplanePolicies, {
      propsData: {
        mesh: 'foo',
        dppName: 'dataplane-test-456',
      },
      routes: [],
      store: {
        state: {
          policiesByType,
        },
      },
    })

    await userEvent.click(await screen.findByText('web'))

    expect(container).toMatchSnapshot()
  })

  it('renders loading', () => {
    renderWithVuex(DataplanePolicies, {
      props: {
        mesh: 'foo',
        dppName: 'dataplane-test-456',
      },
      routes: [],
    })

    expect(screen.getByText('spinner')).toBeInTheDocument()
  })

  it('renders error', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => { }); // silence console errors

    server.use(
      rest.get('http://localhost/meshes/:mesh/dataplanes/:dataplaneName/policies', (req, res, ctx) =>
        res(ctx.status(500), ctx.json({})),
      ),
    )

    renderWithVuex(DataplanePolicies, {
      props: {
        mesh: 'default',
        dppName: 'dataplane-test-456',
      },
      routes: [],
    })

    expect(await screen.findByText(/An error has occurred while trying to load this data./)).toBeInTheDocument()
  })

  it('renders no item', async () => {
    server.use(
      rest.get('http://localhost/meshes/:mesh/dataplanes/:dataplaneName/policies', (req, res, ctx) =>
        res(ctx.status(200), ctx.json({ total: 0, items: [] })),
      ),
    )

    renderWithVuex(DataplanePolicies, {
      props: {
        mesh: 'default',
        dppName: 'dataplane-test-456',
      },
      routes: [],
    })

    expect(await screen.findByText(/There is no data to display./)).toBeInTheDocument()
  })
})
