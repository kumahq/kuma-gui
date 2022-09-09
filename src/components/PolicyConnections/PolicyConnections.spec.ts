import { RouterLinkStub } from '@vue/test-utils'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { KCard, KEmptyState, KIcon } from '@kong/kongponents'

import PolicyConnections from './PolicyConnections.vue'
import { server } from '@/jest-setup'

function renderComponent(props = {}) {
  return render(PolicyConnections, {
    global: {
      components: {
        KCard,
        KEmptyState,
        KIcon,
      },
      stubs: {
        'router-link': RouterLinkStub,
      },
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

    expect(screen.getByTestId('label-list-loading-section')).toBeInTheDocument()
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
