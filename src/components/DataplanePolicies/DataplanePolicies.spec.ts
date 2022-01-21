import { render, screen } from '@testing-library/vue'
import { rest } from 'msw'
import { server } from '@/jest-setup'
import userEvent from '@testing-library/user-event'
import DataplanePolicies from './DataplanePolicies.vue'

describe('DataplanePolicies.vue', () => {
  it('renders snapshot', async () => {
    const { container } = render(DataplanePolicies, {
      props: {
        mesh: 'foo',
        dppName: 'dataplane-test-456',
      },
      routes: [],
    })

    await userEvent.click(await screen.findByText('192.168.0.1:80:81'))

    expect(container).toMatchSnapshot()
  })

  it('renders loading', () => {
    render(DataplanePolicies, {
      props: {
        mesh: 'foo',
        dppName: 'dataplane-test-456',
      },
      routes: [],
    })

    expect(screen.getByText('spinner')).toBeInTheDocument()
  })

  it('renders error', async () => {
    server.use(
      rest.get('http://localhost/meshes/:mesh/dataplanes/:dataplaneName/policies', (req, res, ctx) =>
        res(ctx.status(500), ctx.json({})),
      ),
    )

    render(DataplanePolicies, {
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

    render(DataplanePolicies, {
      props: {
        mesh: 'default',
        dppName: 'dataplane-test-456',
      },
      routes: [],
    })

    expect(await screen.findByText(/There is no data to display./)).toBeInTheDocument()
  })
})
