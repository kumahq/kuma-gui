import { screen } from '@testing-library/vue'
import { rest } from 'msw'

import EnvoyStats from './EnvoyStats.vue'
import { server } from '@/jest-setup'
import renderWithVuex from '@/testUtils/renderWithVuex';

describe('EnvoyStats.vue', () => {
  it('renders snapshot', async () => {
    server.use(
      rest.get('http://localhost/meshes/:mesh/dataplanes/:dataplaneName/stats', (req, res, ctx) =>
        res(ctx.status(200), ctx.json('')),
      ),
    )

    const { container } = renderWithVuex(EnvoyStats, {
      props: {
        mesh: 'foo',
        dppName: 'dataplane-test-456',
      },
      routes: [],
    })

    expect(container).toMatchSnapshot()
  })

  it('renders loading', () => {
    server.use(
      rest.get('http://localhost/meshes/:mesh/dataplanes/:dataplaneName/stats', (req, res, ctx) =>
        res(ctx.status(200), ctx.json('')),
      ),
    )

    renderWithVuex(EnvoyStats, {
      props: {
        mesh: 'foo',
        dppName: 'dataplane-test-456',
      },
      routes: [],
    })

    expect(screen.getByTestId('status-info-loading-section')).toBeInTheDocument()
  })

  it('renders error', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => { }); // silence console errors

    server.use(
      rest.get('http://localhost/meshes/:mesh/dataplanes/:dataplaneName/stats', (req, res, ctx) =>
        res(ctx.status(500), ctx.json('')),
      ),
    )

    renderWithVuex(EnvoyStats, {
      props: {
        mesh: 'default',
        dppName: 'dataplane-test-456',
      },
      routes: [],
    })

    expect(await screen.findByText(/An error has occurred while trying to load this data./)).toBeInTheDocument()
  })
})
