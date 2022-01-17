import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { server } from '@/jest-setup'
import PolicyConnections from './PolicyConnections.vue'

describe('PolicyConnections.vue', () => {
  it('renders snapshot', async () => {
    const { container } = render(PolicyConnections, {
      props: {
        mesh: 'foo',
        policyType: 'foo',
        policyName: 'foo',
      },
      routes: [{ name: 'dataplanes', path: '/' }],
    })

    await screen.findByText('frontend')

    expect(container).toMatchSnapshot()
  })

  it('filters result', async () => {
    render(PolicyConnections, {
      props: {
        mesh: 'foo',
        policyType: 'foo',
        policyName: 'foo',
      },
      routes: [{ name: 'dataplanes', path: '/' }],
    })

    await screen.findByText('frontend')

    expect(screen.getAllByTestId('dataplane-name').length).toBe(3)

    await userEvent.type(screen.getByRole('textbox'), 'b')

    expect(screen.getAllByTestId('dataplane-name').length).toBe(2)
  })

  it('renders loading', () => {
    render(PolicyConnections, {
      props: {
        mesh: 'foo',
        policyType: 'foo',
        policyName: 'foo',
      },
      routes: [{ name: 'dataplanes', path: '/' }],
    })

    expect(screen.getByText('spinner')).toBeInTheDocument()
  })

  it('renders error', async () => {
    server.use(
      rest.get(' http://localhost/meshes/:mesh/:policyType/:policyName/dataplanes', (req, res, ctx) =>
        res(ctx.status(500), ctx.json({})),
      ),
    )

    render(PolicyConnections, {
      props: {
        mesh: 'foo',
        policyType: 'foo',
        policyName: 'foo',
      },
      routes: [{ name: 'dataplanes', path: '/' }],
    })

    expect(await screen.findByText(/An error has occurred while trying to load this data./)).toBeInTheDocument()
  })

  it('renders no item', async () => {
    server.use(
      rest.get(' http://localhost/meshes/:mesh/:policyType/:policyName/dataplanes', (req, res, ctx) =>
        res(ctx.status(200), ctx.json({ total: 0, items: [] })),
      ),
    )

    render(PolicyConnections, {
      props: {
        mesh: 'foo',
        policyType: 'foo',
        policyName: 'foo',
      },
      routes: [{ name: 'dataplanes', path: '/' }],
    })

    expect(await screen.findByText(/There is no data to display./)).toBeInTheDocument()
  })
})
