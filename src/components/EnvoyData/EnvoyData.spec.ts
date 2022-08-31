import { render, screen } from '@testing-library/vue'
import { rest } from 'msw'

import EnvoyData from './EnvoyData.vue'
import { server } from '@/jest-setup'

function renderComponent(props = {}) {
  return render(EnvoyData, {
    props: {
      dataPath: 'clusters',
      ...props,
    },
  })
}

describe('EnvoyData.vue', () => {
  it('renders snapshot', async () => {
    server.use(
      rest.get('http://localhost/meshes/:mesh/dataplanes/:dataplaneName/clusters', (req, res, ctx) =>
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
      rest.get('http://localhost/meshes/:mesh/dataplanes/:dataplaneName/clusters', (req, res, ctx) =>
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
    server.use(
      rest.get('http://localhost/meshes/:mesh/dataplanes/:dataplaneName/clusters', (req, res, ctx) =>
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
