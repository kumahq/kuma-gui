import { render, screen } from '@testing-library/vue'
import { rest } from 'msw'
import { KButton, KCard, KClipboardProvider, KEmptyState, KIcon, KPop } from '@kong/kongponents'

import EnvoyStats from './EnvoyStats.vue'
import { server } from '@/jest-setup'

function renderComponent(props = {}) {
  return render(EnvoyStats, {
    global: {
      components: {
        KButton,
        KCard,
        KClipboardProvider,
        KEmptyState,
        KIcon,
        KPop,
      },
    },
    props,
  })
}

describe('EnvoyStats.vue', () => {
  it('renders snapshot', async () => {
    server.use(
      rest.get('http://localhost/meshes/:mesh/dataplanes/:dataplaneName/stats', (req, res, ctx) =>
        res(ctx.status(200), ctx.json('')),
      ),
    )

    const { container } = renderComponent({
      mesh: 'foo',
      dppName: 'dataplane-test-456',
    })

    expect(container).toMatchSnapshot()
  })

  it('renders loading', () => {
    server.use(
      rest.get('http://localhost/meshes/:mesh/dataplanes/:dataplaneName/stats', (req, res, ctx) =>
        res(ctx.status(200), ctx.json('')),
      ),
    )

    renderComponent({
      mesh: 'foo',
      dppName: 'dataplane-test-456',
    })

    expect(screen.getByTestId('status-info-loading-section')).toBeInTheDocument()
  })

  it('renders error', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => { }) // silence console errors

    server.use(
      rest.get('http://localhost/meshes/:mesh/dataplanes/:dataplaneName/stats', (req, res, ctx) =>
        res(ctx.status(500), ctx.json('')),
      ),
    )

    renderComponent({
      mesh: 'default',
      dppName: 'dataplane-test-456',
    })

    expect(await screen.findByText(/An error has occurred while trying to load this data./)).toBeInTheDocument()
  })
})
