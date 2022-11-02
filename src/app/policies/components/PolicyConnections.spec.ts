import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'

import PolicyConnections from './PolicyConnections.vue'
import { createRouter } from '@/router/router'
import { server } from '@/../jest/jest-setup'

const router = createRouter()

function renderComponent(props = {}) {
  return render(PolicyConnections, {
    global: {
      plugins: [router],
    },
    props,
  })
}

describe('PolicyConnections.vue', () => {
  it('renders snapshot', async () => {
    const { container } = renderComponent({
      mesh: 'foo',
      policyType: 'foo',
      policyName: 'foo',
    })

    await screen.findByText('frontend')

    expect(container).toMatchSnapshot()
  })

  it('filters result', async () => {
    renderComponent({
      mesh: 'foo',
      policyType: 'foo',
      policyName: 'foo',
    })

    await screen.findByText('frontend')

    expect(screen.getAllByTestId('dataplane-name').length).toBe(3)

    await userEvent.type(screen.getByRole('textbox'), 'b')

    expect(screen.getAllByTestId('dataplane-name').length).toBe(2)
  })

  it('renders loading', () => {
    renderComponent({
      mesh: 'foo',
      policyType: 'foo',
      policyName: 'foo',
    })

    expect(screen.getByTestId('loading-block')).toBeInTheDocument()
  })

  it('renders error', async () => {
    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + 'meshes/:mesh/:policyType/:policyName/dataplanes', (req, res, ctx) =>
        res(ctx.status(500), ctx.json({})),
      ),
    )

    renderComponent({
      mesh: 'foo',
      policyType: 'foo',
      policyName: 'foo',
    })

    expect(await screen.findByText(/An error has occurred while trying to load this data./)).toBeInTheDocument()
  })

  it('renders no item', async () => {
    server.use(
      rest.get(import.meta.env.VITE_KUMA_API_SERVER_URL + 'meshes/:mesh/:policyType/:policyName/dataplanes', (req, res, ctx) =>
        res(ctx.status(200), ctx.json({ total: 0, items: [] })),
      ),
    )

    renderComponent({
      mesh: 'foo',
      policyType: 'foo',
      policyName: 'foo',
    })

    expect(await screen.findByText(/There is no data to display./)).toBeInTheDocument()
  })
})
